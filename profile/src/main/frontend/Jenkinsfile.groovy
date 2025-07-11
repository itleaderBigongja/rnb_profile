// frontend/Jenkinsfile ( Declarative Pipline )
pipeline {
    agent any

    environment {
        REMOTE_SERVER_IP = '192.168.1.181'
        REMOTE_USER = 'rnb'
        REMOTE_FRONTEND_DIR = '/var/www/frontend' // Nginx 웹 루트
        NGINX_CONF_SOURCE_PATH = 'profile/nginx/default.conf' // Jenkins 워크스페이스 내 Nginx 설정 파일 경로
        NGINX_SITES_AVAILABLE_PATH = '/etc/nginx/sites-available/frontend.conf'
        NGINX_SITES_ENABLED_PATH = '/etc/nginx/sites-enabled/frontend.conf'
        REMOTE_PROJECT_ROOT_ON_SERVER = '/home/rnb/rnb_profile_repo'
        //Ubuntu 서버에 Git clone 할 경로. 여기서는 /home/rnb/rnb_profile 로 가정합니다.
    }

    stages {
        stage('Checkout Source') {
            steps {
                git branch: 'master', url: 'https://github.com/itleaderBigongja/rnb_profile.git', credentialsId: 'rnb_profile'
            }
        }

        // --- 새로운 스테이지: 원격 Ubuntu 서버에서 코드 가져오기 및 빌드 실행 ---
        stage('Prepare Remote Server & Build Frontend') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'server-login-credentials', usernameVariable: 'SERVER_USER', passwordVariable: 'SERVER_PASS')]) {
                        // 1. 원격 서버에 프로젝트 루트 디렉토리 생성 (최초 1회 실행)
                        sh 'sshpass -p "${SERVER_PASS}" ssh -o StrictHostKeyChecking=no ${SERVER_USER}@' + "${REMOTE_SERVER_IP}" + ' "mkdir -p ' + "${REMOTE_PROJECT_ROOT_ON_SERVER}" + '"'

                        // 2. 원격 서버에서 Git Pull 또는 Clone (코드 동기화)
                        sh 'sshpass -p "${SERVER_PASS}" ssh -o StrictHostKeyChecking=no ${SERVER_USER}@' + "${REMOTE_SERVER_IP}" + ' "cd ' + "${REMOTE_PROJECT_ROOT_ON_SERVER}" + ' && sudo git config core.sparsecheckout || true && sudo git pull origin master || sudo git clone https://github.com/itleaderBigongja/rnb_profile.git ."'

                        // 3. 원격 서버의 프론트엔드(React) 디렉토리로 이동하여 npm 빌드 실행
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
                        sh 'sshpass -p "${SERVER_PASS}" scp -o StrictHostKeyChecking=no ' + "${NGINX_CONF_SOURCE_PATH}" + ' ${SERVER_USER}@' + "${REMOTE_SERVER_IP}" + ':' + "${NGINX_SITES_AVAILABLE_PATH}"

                        // 2. 원격 서버에서 기존 React 배포 디렉토리 삭제 및 새로운 빌드 결과물 복사
                        //    심볼릭 링크 생성 및 Nginx 재시작
                        sh '''
                            sshpass -p "${SERVER_PASS}" ssh -o StrictHostKeyChecking=no ${SERVER_USER}@''' + "${REMOTE_SERVER_IP}" + ''' "
                                sudo rm -rf ''' + "${REMOTE_FRONTEND_DIR}" + '''/* && \
                                sudo cp -r ''' + "${REMOTE_PROJECT_ROOT_ON_SERVER}" + '''/profile/src/main/frontend/dist/* ''' + "${REMOTE_FRONTEND_DIR}" + '''/ && \
                                sudo rm -f ''' + "${NGINX_SITES_ENABLED_PATH}" + ''' || true && \
                                sudo ln -s ''' + "${NGINX_SITES_AVAILABLE_PATH}" + ''' ''' + "${NGINX_SITES_ENABLED_PATH}" + ''' && \
                                sudo nginx -t && \
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