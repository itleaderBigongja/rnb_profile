// frontend/Jenkinsfile ( Declarative Pipeline )
pipeline {
    agent any // Jenkins 컨테이너에서 실행 (실제 빌드/배포는 원격 Ubuntu 서버에서 수행)

    environment {
        REMOTE_SERVER_IP = '192.168.1.181'            // 원격 Ubuntu 서버 IP 주소
        REMOTE_USER = 'rnb'                           // 원격 Ubuntu 서버 사용자 이름
        REMOTE_FRONTEND_DIR = '/var/www/frontend'     // Nginx 웹 루트 (React 빌드 결과물 배포 경로)
        // Jenkins 워크스페이스 내 Nginx 설정 파일 경로.
        // Git 저장소 루트에서 'profile/nginx/default.conf'를 가리킵니다.
        NGINX_CONF_SOURCE_PATH = 'profile/nginx/default.conf'
        NGINX_SITES_AVAILABLE_PATH = '/etc/nginx/sites-available/frontend.conf' // Nginx sites-available 경로
        NGINX_SITES_ENABLED_PATH = '/etc/nginx/sites-enabled/frontend.conf'     // Nginx sites-enabled 경로
        // 중요: Ubuntu 서버에 Git clone 할 최상위 경로.
        REMOTE_PROJECT_ROOT_ON_SERVER = '/home/rnb/rnb_profile_repo'
    }

    stages {
        stage('Checkout Source (Jenkins Workspace)') {
            steps {
                // Jenkins 컨테이너의 워크스페이스에 Git 저장소 코드를 체크아웃합니다.
                // Nginx 설정 파일(NGINX_CONF_SOURCE_PATH)을 원격 서버로 전송하기 위해 필요합니다.
                git branch: 'master', url: 'https://github.com/itleaderBigongja/rnb_profile.git', credentialsId: 'rnb_profile'
            }
        }

        stage('Prepare Remote Server & Build Frontend') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'server-login-credentials', usernameVariable: 'rnb', passwordVariable: 'rnb6707')]) {
                        // 1. 원격 서버에 프로젝트 최상위 루트 디렉토리 생성 (최초 1회 실행)
                        sh 'sshpass -p "${SERVER_PASS}" ssh -o StrictHostKeyChecking=no ${SERVER_USER}@' + "${REMOTE_SERVER_IP}" + ' "mkdir -p ' + "${REMOTE_PROJECT_ROOT_ON_SERVER}" + '"'

                        // 2. 원격 서버에서 Git Pull 또는 Clone (코드 동기화)
                        // '/home/rnb/rnb_profile_repo/' 아래에 'profile/' 디렉토리가 생성됩니다.
                        sh 'sshpass -p "${SERVER_PASS}" ssh -o StrictHostKeyChecking=no ${SERVER_USER}@' + "${REMOTE_SERVER_IP}" + ' "cd ' + "${REMOTE_PROJECT_ROOT_ON_SERVER}" + ' && sudo git config core.sparsecheckout || true && sudo git pull origin master || sudo git clone https://github.com/itleaderBigongja/rnb_profile.git ."'

                        // 3. 원격 서버의 프론트엔드(React) 디렉토리로 이동하여 npm 빌드 실행
                        // 이제 React 프로젝트가 있는 'profile/src/main/frontend' 디렉토리로 이동하여 빌드를 수행합니다.
                        sh 'sshpass -p "${SERVER_PASS}" ssh -o StrictHostKeyChecking=no ${SERVER_USER}@' + "${REMOTE_SERVER_IP}" + ' "cd ' + "${REMOTE_PROJECT_ROOT_ON_SERVER}" + '/profile/src/main/frontend && sudo npm install && sudo npm run build"'
                    }
                }
            }
        }

        stage('Deploy React App and Nginx Config') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'server-login-credentials', usernameVariable: 'rnb', passwordVariable: 'rnb6707')]) {
                        // 1. Nginx 설정 파일 배포 (Jenkins 워크스페이스에서 원격 서버로 복사)
                        // Jenkins가 체크아웃한 Nginx 설정 파일을 원격 서버의 'sites-available' 경로로 전송합니다.
                        sh 'sshpass -p "${SERVER_PASS}" scp -o StrictHostKeyChecking=no ' + "${NGINX_CONF_SOURCE_PATH}" + ' ${SERVER_USER}@' + "${REMOTE_SERVER_IP}" + ':' + "${NGINX_SITES_AVAILABLE_PATH}"

                        // 2. 원격 서버에서 React 빌드 결과물 배포 및 Nginx 설정 활성화, 재시작
                        // 여러 명령을 한 번의 SSH 세션으로 묶어 실행합니다.
                        sh '''
                            sshpass -p "${SERVER_PASS}" ssh -o StrictHostKeyChecking=no ${SERVER_USER}@''' + "${REMOTE_SERVER_IP}" + ''' "
                                # 기존 프론트엔드 디렉토리 내용을 삭제
                                sudo rm -rf ''' + "${REMOTE_FRONTEND_DIR}" + '''/* && \
                                # 새로 빌드된 React 결과물 복사. React 빌드 시 'dist' 디렉토리에 결과물이 생성된다고 가정합니다.
                                sudo cp -r ''' + "${REMOTE_PROJECT_ROOT_ON_SERVER}" + '''/profile/src/main/frontend/dist/* ''' + "${REMOTE_FRONTEND_DIR}" + '''/ && \
                                # 기존 심볼릭 링크 삭제 (존재하지 않아도 오류 없음)
                                sudo rm -f ''' + "${NGINX_SITES_ENABLED_PATH}" + ''' || true && \
                                # 새 심볼릭 링크 생성 (sites-available -> sites-enabled)
                                sudo ln -s ''' + "${NGINX_SITES_AVAILABLE_PATH}" + ''' ''' + "${NGINX_SITES_ENABLED_PATH}" + ''' && \
                                # Nginx 설정 파일 유효성 검사
                                sudo nginx -t && \
                                # Nginx 서비스 재시작
                                sudo systemctl restart nginx
                            "
                        '''
                    }
                }
            }
        }
    }

    post {
        always { echo "React CI/CD Pipeline Finished!" }
        success { echo "React CI/CD Pipeline Succeeded!" }
        failure { echo "React CI/CD Pipeline Failed!" }
    }
}