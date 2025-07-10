// frontend/Jenkinsfile ( Declarative Pipline )
pipline {
    // Jenkins 에이전트가 어떤 환경에서든 이 파이프라인을 실행할 수 있음을 나타냄
    agent any

    // 파이프라인 전반에 걸쳐 사용될 환경 변수 정의
    environment {
        //REMOTE_SERVER_IP = '192.168.1.181' // 원격 서버 IP (실제 배포 서버 IP로 변경)
        REMOTE_SERVER_IP = '192.168.0.25'
        REMOTE_FRONTEND_DIR = '/var/www/frontend' // React 앱이 배포될 원격 서버 디렉토리
        NGINX_CONF_SOURCE_PATH = 'profile/nginx/default.conf' // Git 저장소 내 Nginx 설정 파일 원본 경로
        NGINX_SITES_AVAILABLE_PATH = '/etc/nginx/sites-available/frontend.conf' // 원격 서버의 Nginx sites-available 디렉토리 내 설정 파일 경로 (원본)
        NGINX_SITES_ENABLED_PATH = '/etc/nginx/sites-enabled/frontend.conf' // 원격 서버의 Nginx sites-enabled 디렉토리 내 심볼릭 링크 경로
    }

    // CI/CD 파이프라인 주요 단계를 정의
    stages {
        stage('Checkout Source') {
            steps {
                git branch: 'master', url: 'https://github.com/itleaderBigongja/rnb_profile.git', credentialsId: 'rnb_profile'
            }
        }

        stage('Build React App') {
            steps {
                // React 프로젝트의 실제 루트 디렉토리로 이동하여 빌드 명령 실행
                dir('profile/src/main/frontend') {
                    sh 'npm install'
                    // 'npm run build' 명령으로 'dist' 디렉토리에 빌드 결과물이 생성됩니다.
                    sh 'npm run build'
                }
            }
        }

        stage('Install sshpass') {
            steps {
                script {
                    // --- 수정된 부분: Docker agent에서 root 유저로 전환하여 apt-get 실행 ---
                    docker.image('jenkins/jenkins:lts').inside('-u root') { // <-- 이 부분을 추가/수정
                        sh 'apt-get update && apt-get install -y sshpass'
                    }
                    // --- 여기까지 ---
                }
            }
        }

        stage('Deploy React App and Nginx Config') {
            steps {
                script {
                    // Jenkins에 등록된 SSH 접속 자격 증명 사용
                    //    'rnb', 'rnb6707'은 credentialsId가 아닌, 변수 이름과 값으로 직접 사용될 수 있습니다.
                    //    crednetialsId: 'server-login-credentials'를 사용했다면,
                    //    usernameVariable: 'SERVER_USER', passwordVariable: 'SERVER_PASS'를 사용해야 합니다.
                    //    현재 코드에서는 credentialsId: 'rnb_profile'을 사용하고 있는데,
                    //    SSH 접속에는 'server-login-credentials'를 사용하는 것이 일관적입니다.
                    //    아래 예시에서는 credentialsId를 'server-login-credentials'로 가정하고
                    //    usernameVariable/passwordVariable을 사용했습니다.
                    withCredentials([usernamePassword(credentialsId: 'server-login-credentials', usernameVariable: 'rnb', passwordVariable: 'rnb6707')]) {
                        // 원격 서버에 sshpass 설치 확인 (이미 설치되어 있어도 오류 무시)
                        sh 'sshpass -p "${SERVER_PASS}" ssh -o StrictHostKeyChecking=no ${SERVER_USER}@' + "${REMOTE_SERVER_IP}" + ' "sudo apt-get update && sudo apt-get install -y sshpass || true"'

                        // 1. React 빌드 결과물 배포
                        // 원격 서버의 기존 배포 디렉토리 내용을 삭제
                        sh 'sshpass -p "${SERVER_PASS}" ssh -o StrictHostKeyChecking=no ${SERVER_USER}@' + "${REMOTE_SERVER_IP}" + ' "sudo rm -rf ' + "${REMOTE_FRONTEND_DIR}" + '/*"'

                        // 수정된 부분: 빌드 결과물 디렉토리 'dist'를 'frontend'라는 이름으로 원격 서버에 복사
                        // source: profile/src/main/frontend/dist/* (npm 설치 디렉토리 내의 빌드 결과물)
                        // target: ${REMOTE_FRONTEND_DIR} (서버의 /var/www/frontend)
                        // scp 명령어는 마지막 인자가 대상 디렉토리이므로, 파일들을 그 디렉토리 안으로 복사합니다.
                        sh 'sshpass -p "${SERVER_PASS}" scp -o StrictHostKeyChecking=no -r profile/src/main/frontend/dist/* ${SERVER_USER}@' + "${REMOTE_SERVER_IP}" + ':' + "${REMOTE_FRONTEND_DIR}"

                        // 2. Nginx 설정 파일 배포 및 적용
                        // Git 저장소의 Nginx 설정 파일을 원격 서버의 sites-available 디렉토리로 복사
                        sh 'sshpass -p "${SERVER_PASS}" scp -o StrictHostKeyChecking=no ' + "${NGINX_CONF_SOURCE_PATH}" + ' ${SERVER_USER}@' + "${REMOTE_SERVER_IP}" + ':' + "${NGINX_SITES_AVAILABLE_PATH}"

                        // 원격 서버에서 Nginx 설정 파일의 심볼릭 링크 생성 (기존에 있으면 삭제 후 다시 생성) 및 Nginx 재시작
                        sh '''
                            sshpass -p "${SERVER_PASS}" ssh -o StrictHostKeyChecking=no ${SERVER_USER}@''' + "${REMOTE_SERVER_IP}" + ''' "
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
        always {
            echo "React CI/CD Pipeline Finished!"
        }
        success {
            echo "React CI/CD Pipeline Succeeded!"
        }
        failure {
            echo "React CI/CD Pipeline Failed!"
        }
    }
}