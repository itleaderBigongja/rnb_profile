// profile/Jenkinsfile ( Declarative Pipeline )
pipeline {
    agent any // Jenkins 컨테이너에서 실행 (실제 빌드/배포는 원격 Ubuntu 서버에서 수행)

    environment {
        ACTUAL_WAR_NAME = 'profile-0.0.1-SNAPSHOT.war' // Maven 빌드 시 생성되는 WAR 파일 이름
        DEPLOY_WAR_NAME = 'profile.war'               // Tomcat에 배포될 WAR 파일 이름
        REMOTE_SERVER_IP = '192.168.1.181'            // 원격 Ubuntu 서버 IP 주소
        REMOTE_USER = 'rnb'                           // 원격 Ubuntu 서버 사용자 이름
        REMOTE_TOMCAT_WEBAPPS_DIR = '/opt/tomcat/webapps' // 원격 Tomcat webapps 경로
        // 중요: Ubuntu 서버에 Git clone 할 최상위 경로.
        // 여기에 'rnb_profile.git' 저장소 전체가 클론됩니다.
        REMOTE_PROJECT_ROOT_ON_SERVER = '/home/rnb/rnb_profile_repo'
    }

    stages {
        stage('Checkout Source (Jenkins Workspace)') {
            steps {
                // Jenkins 컨테이너의 워크스페이스에 Git 저장소 코드를 체크아웃합니다.
                // 이 코드는 Jenkinsfile 자체를 읽거나, Nginx 설정 파일 등 Jenkins 워크스페이스에 필요한 파일을 위해 사용됩니다.
                // 실제 백엔드/프론트엔드 빌드에 사용될 소스 코드는 아래 Stage에서 원격 서버에 직접 클론/풀 합니다.
                git branch: 'master', url: 'https://github.com/itleaderBigongja/rnb_profile.git', credentialsId: 'rnb_profile'
            }
        }

        stage('Prepare Remote Server & Build Backend') {
            steps {
                script {
                    // Jenkins에 등록된 'server-login-credentials'를 사용하여 SSH 접속 정보 획득
                    withCredentials([usernamePassword(credentialsId: 'server-login-credentials', usernameVariable: 'rnb', passwordVariable: 'rnb6707')]) {
                        // 1. 원격 서버에 프로젝트 최상위 루트 디렉토리 생성 (최초 1회 실행)
                        // 'mkdir -p'는 디렉토리가 이미 존재해도 오류 없이 생성합니다.
                        sh 'sshpass -p "${SERVER_PASS}" ssh -o StrictHostKeyChecking=no ${SERVER_USER}@' + "${REMOTE_SERVER_IP}" + ' "mkdir -p ' + "${REMOTE_PROJECT_ROOT_ON_SERVER}" + '"'

                        // 2. 원격 서버에서 Git Pull 또는 Clone (코드 동기화)
                        // 'REMOTE_PROJECT_ROOT_ON_SERVER' 디렉토리로 이동하여 'rnb_profile.git' 저장소를 클론/풀 합니다.
                        // 이렇게 하면 '/home/rnb/rnb_profile_repo/' 아래에 'profile/' 디렉토리가 생성됩니다.
                        sh 'sshpass -p "${SERVER_PASS}" ssh -o StrictHostKeyChecking=no ${SERVER_USER}@' + "${REMOTE_SERVER_IP}" + ' "cd ' + "${REMOTE_PROJECT_ROOT_ON_SERVER}" + ' && sudo git config core.sparsecheckout || true && sudo git pull origin master || sudo git clone https://github.com/itleaderBigongja/rnb_profile.git ."'

                        // 3. 원격 서버의 백엔드(Spring Boot) 디렉토리로 이동하여 Maven 빌드 실행
                        // 이제 'pom.xml'이 있는 'profile' 디렉토리로 이동하여 빌드를 수행합니다.
                        sh 'sshpass -p "${SERVER_PASS}" ssh -o StrictHostKeyChecking=no ${SERVER_USER}@' + "${REMOTE_SERVER_IP}" + ' "cd ' + "${REMOTE_PROJECT_ROOT_ON_SERVER}" + '/profile && sudo mvn clean package -DskipTests"'
                    }
                }
            }
        }

        stage('Deploy Java App') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'server-login-credentials', usernameVariable: 'rnb', passwordVariable: 'rnb6707')]) {
                        // 1. 원격 서버의 기존 WAR 파일 삭제 (sudo 사용)
                        // Tomcat이 WAR 파일을 언로드할 수 있도록 기존 파일을 먼저 제거합니다.
                        sh 'sshpass -p "${SERVER_PASS}" ssh -o StrictHostKeyChecking=no ${SERVER_USER}@' + "${REMOTE_SERVER_IP}" + ' "sudo rm -f ' + "${REMOTE_TOMCAT_WEBAPPS_DIR}" + '/' + "${DEPLOY_WAR_NAME}" + '"'

                        // 2. 원격 서버의 빌드 결과물(WAR 파일)을 Tomcat webapps 경로로 복사 (sudo 사용)
                        // 'target' 디렉토리는 'profile' 디렉토리 내에 생성됩니다.
                        sh 'sshpass -p "${SERVER_PASS}" ssh -o StrictHostKeyChecking=no ${SERVER_USER}@' + "${REMOTE_SERVER_IP}" + ' "sudo cp ' + "${REMOTE_PROJECT_ROOT_ON_SERVER}" + '/profile/target/' + "${ACTUAL_WAR_NAME}" + ' ' + "${REMOTE_TOMCAT_WEBAPPS_DIR}" + '/' + "${DEPLOY_WAR_NAME}" + '"'

                        // 3. Tomcat 서비스 재시작 (sudo 사용)
                        // 새로운 WAR 파일을 로드하고 변경 사항을 적용하기 위해 Tomcat을 재시작합니다.
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