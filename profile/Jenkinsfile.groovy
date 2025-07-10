// profile/Jenkinsfile ( Declarative Pipeline )
pipeline {
    agent any

    environment {

        // Maven 빌드 시 생성되는 실제 WAR 파일 이름( 버전 포함 )
        ACTUAL_WAR_NAME = 'profile-0.0.1-SNAPSHOT.war'

        // 서버로 배포될 때 사용할 WAR 파일 이름 (Tomcat이 인식할 이름)
        DEPLOY_WAR_NAME = 'profile.war'

        // 원격 서버 IP( 실제 Ubuntu 서버 IP로 변경 )
        // REMOTE_SERVER_IP = '192.168.1.181'
        REMOTE_SERVER_IP = '192.168.0.25'

        // 원격 서버의 Tomcat webapps 경로
        REMOTE_TOMCAT_WEBAPPS_DIR = '/opt/tomcat/webapps'
    }

    stages {
        stage('Checkout Source') {
            steps {
                git branch: 'master', url: 'https://github.com/itleaderBigongja/rnb_profile.git', credentialsId: 'rnb_profile'
            }
        }

        stage('Build Java App') {
            steps {
                // Spring Boot 프로젝트의 실제 빌드 루트 디렉토리로 이동하여 Maven 빌드 명령 실행
                dir('profile') { // <--- 이 부분을 수정
                    sh 'mvn clean package -DskipTests'
                }
            }
        }

        // --- 새로운 스테이지 추가 또는 기존 Deploy 스테이지 내부에 추가 ---
        stage('Install Deployment Tools') { // 예시: sshpass, rsync 등 배포 도구 설치
            steps {
                script {
                    // Jenkins 컨테이너 내부에서 apt 업데이트 및 sshpass 설치
                    sh 'apt-get update && apt-get install -y sshpass'
                    // sudo를 사용하지 않는 이유는 Jenkins Docker 컨테이너 내부는 jenkins 유저가 root에 가까운 권한을 가지기 때문입니다.
                    // 만약 permission denied 에러가 발생하면 agent { docker { image 'jenkins/jenkins:lts' args '-u root' } }를 고려해야 합니다.
                }
            }
        }

        stage('Deploy Java App') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'server-login-credentials', usernameVariable: 'rnb', passwordVariable: 'rnb6707')]) {
                        // sshpass 설치 확인
                        sh 'sshpass -p "${SERVER_PASS}" ssh -o StrictHostKeyChecking=no ${SERVER_USER}@' + "${REMOTE_SERVER_IP}" + ' "sudo apt-get update && sudo apt-get install -y sshpass || true"'

                        // 1. 기존 WAR 파일 삭제 (Tomcat이 새로운 WAR 파일을 감지하고 재배포하도록 유도)
                        // 삭제할 파일은 서버에 배포될 이름이어야 합니다.
                        sh 'sshpass -p "${SERVER_PASS}" ssh -o StrictHostKeyChecking=no ${SERVER_USER}@' + "${REMOTE_SERVER_IP}" + ' "sudo rm -f ' + "${REMOTE_TOMCAT_WEBAPPS_DIR}" + '/' + "${DEPLOY_WAR_NAME}" + '"'

                        // 2. 새로운 WAR 파일 복사
                        // source 경로: profile/target/ACTUAL_WAR_NAME (빌드된 파일)
                        // target 경로: REMOTE_TOMCAT_WEBAPPS_DIR/DEPLOY_WAR_NAME (서버에 배포될 이름)
                        sh 'sshpass -p "${SERVER_PASS}" scp -o StrictHostKeyChecking=no profile/target/' + "${ACTUAL_WAR_NAME}" + ' ${SERVER_USER}@' + "${REMOTE_SERVER_IP}" + ':' + "${REMOTE_TOMCAT_WEBAPPS_DIR}" + '/' + "${DEPLOY_WAR_NAME}"

                        // 3. Tomcat 서비스 재시작 (권장)
                        sh 'sshpass -p "${SERVER_PASS}" ssh -o StrictHostKeyChecking=no ${SERVER_USER}@' + "${REMOTE_SERVER_IP}" + ' "sudo systemctl restart tomcat"'
                    }
                }
            }
        }
    }

    post {
        always {
            echo "Java CI/CD Pipeline Finished!"
        }
        success {
            echo "Java CI/CD Pipeline Succeeded!"
        }
        failure {
            echo "Java CI/CD Pipeline Failed!"
        }
    }
}