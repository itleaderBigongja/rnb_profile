// profile/Jenkinsfile ( Declarative Pipeline )
pipeline {
    agent any // Jenkins 컨테이너에서 실행 (빌드 도구는 Ubuntu 서버에 있으므로, 이 컨테이너는 가벼워도 됨)

    environment {
        ACTUAL_WAR_NAME = 'profile-0.0.1-SNAPSHOT.war' // Maven 빌드 시 생성되는 WAR 파일 이름
        DEPLOY_WAR_NAME = 'profile.war'               // Tomcat에 배포될 WAR 파일 이름
        REMOTE_SERVER_IP = '192.168.1.181'            // 원격 Ubuntu 서버 IP
        REMOTE_USER = 'rnb'                           // 원격 Ubuntu 서버 사용자 이름
        REMOTE_TOMCAT_WEBAPPS_DIR = '/opt/tomcat/webapps' // 원격 Tomcat webapps 경로

        //Ubuntu 서버에 Git clone 할 경로. 여기서는 /home/rnb/rnb_profile 로 가정합니다.
        // 이 경로는 Ubuntu 서버에서 git clone을 수행할 위치입니다.
        REMOTE_PROJECT_ROOT_ON_SERVER = '/home/rnb/rnb_profile_repo'
    }

    stages {
        stage('Checkout Source') {
            steps {
                // Jenkins 컨테이너의 워크스페이스에 Git 저장소 코드를 체크아웃합니다.
                // 이 코드는 빌드에 직접 사용되지 않고, 주로 배포에 사용될 Nginx 설정 파일 등을 위함입니다.
                // 또한, 필요 시 Jenkins 워크스페이스의 코드를 원격 서버로 전송하는 데 사용됩니다.
                git branch: 'master', url: 'https://github.com/itleaderBigongja/rnb_profile.git', credentialsId: 'rnb_profile'
            }
        }

        // --- 새로운 스테이지: 원격 Ubuntu 서버에서 코드 가져오기 및 빌드 실행 ---
        stage('Prepare Remote Server & Build Backend') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'server-login-credentials', usernameVariable: 'SERVER_USER', passwordVariable: 'SERVER_PASS')]) {
                        // 1. 원격 서버에 프로젝트 루트 디렉토리 생성 (최초 1회 실행)
                        sh 'sshpass -p "${SERVER_PASS}" ssh -o StrictHostKeyChecking=no ${SERVER_USER}@' + "${REMOTE_SERVER_IP}" + ' "mkdir -p ' + "${REMOTE_PROJECT_ROOT_ON_SERVER}" + '"'

                        // 2. 원격 서버에서 Git Pull 또는 Clone (코드 동기화)
                        // 이미 clone 되어 있다면 pull, 아니면 clone
                        sh 'sshpass -p "${SERVER_PASS}" ssh -o StrictHostKeyChecking=no ${SERVER_USER}@' + "${REMOTE_SERVER_IP}" + ' "cd ' + "${REMOTE_PROJECT_ROOT_ON_SERVER}" + ' && sudo git config core.sparsecheckout || true && sudo git pull origin master || sudo git clone https://github.com/itleaderBigongja/rnb_profile.git ."'

                        // 3. 원격 서버의 백엔드(Spring Boot) 디렉토리로 이동하여 Maven 빌드 실행
                        // 'profile' 디렉토리가 Git 저장소의 루트이므로, 'profile' 경로를 직접 사용
                        sh 'sshpass -p "${SERVER_PASS}" ssh -o StrictHostKeyChecking=no ${SERVER_USER}@' + "${REMOTE_SERVER_IP}" + ' "cd ' + "${REMOTE_PROJECT_ROOT_ON_SERVER}" + '/profile && sudo mvn clean package -DskipTests"'
                    }
                }
            }
        }

        stage('Deploy Java App') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'server-login-credentials', usernameVariable: 'rnb', passwordVariable: 'rnb6707')]) {
                        // 1. 원격 서버의 기존 WAR 파일 삭제
                        sh 'sshpass -p "${SERVER_PASS}" ssh -o StrictHostKeyChecking=no ${SERVER_USER}@' + "${REMOTE_SERVER_IP}" + ' "sudo rm -f ' + "${REMOTE_TOMCAT_WEBAPPS_DIR}" + '/' + "${DEPLOY_WAR_NAME}" + '"'

                        // 2. 원격 서버의 빌드 결과물(WAR 파일)을 Tomcat webapps 경로로 복사
                        // scp는 Jenkins->Host로 파일을 "전송"하는 것이므로, 이미 원격에 있는 파일을 옮기려면 ssh 명령으로 cp를 사용해야 합니다.
                        sh 'sshpass -p "${SERVER_PASS}" ssh -o StrictHostKeyChecking=no ${SERVER_USER}@' + "${REMOTE_SERVER_IP}" + ' "sudo cp ' + "${REMOTE_PROJECT_ROOT_ON_SERVER}" + '/profile/target/' + "${ACTUAL_WAR_NAME}" + ' ' + "${REMOTE_TOMCAT_WEBAPPS_DIR}" + '/' + "${DEPLOY_WAR_NAME}" + '"'

                        // 3. Tomcat 서비스 재시작
                        sh 'sshpass -p "${SERVER_PASS}" ssh -o StrictHostKeyChecking=no ${SERVER_USER}@' + "${REMOTE_SERVER_IP}" + ' "sudo systemctl restart tomcat"'
                    }
                }
            }
        }
    }

    post {
        always { echo "Java CI/CD Pipeline Finished!" }
        success { echo "Java CI/CD Pipeline Succeeded!" }
        failure { echo "Java CI/CD Pipeline Failed!" }
    }
}