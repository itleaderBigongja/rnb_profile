## Tomcat 10.1.x (정확히 10.1.42 버전 명시 불가, 해당 라인의 최신 버전) 및 Temurin JDK 17 (정확히 17.0.15 버전 명시 불가, 해당 라인의 최신 버전)을 포함하는 기본 이미지 사용.
## Docker Hub의 tomcat 이미지 중 `10.1-jdk17-temurin-jammy`는 Tomcat 10.1.x와 Temurin OpenJDK 17의 최신 패치 버전을 포함합니다.
#FROM tomcat:10.1-jdk17-temurin-jammy
#
## WAR 파일 이름을 환경 변수로 설정하여 Dockerfile 재사용성을 높임
## your-java-app.war 부분을 실제 Maven/Gradle 빌드 결과로 생성되는 WAR 파일 이름으로 변경하세요.
## 예: your Spring Boot project produces a WAR named 'profile-0.0.1-SNAPSHOT.war'
## then set ARG WAR_NAME=profile-0.0.1-SNAPSHOT.war and COPY target/${WAR_NAME} ...
## 이 부분을 실제 WAR 파일 이름으로 정확히 변경!
#ARG WAR_NAME=profile.war
#
## 빌드된 WAR 파일을 Tomcat의 webapps 디렉토리에 복사
## `COPY target/${WAR_NAME}`은 Docker build context (Jenkins가 클론한 Git 저장소의 'profile' 디렉토리)에서
## `target/` 경로에 있는 WAR 파일을 찾아 복사합니다.
#COPY target/${WAR_NAME} /opt/tomcat/webapps/${WAR_NAME}
#
## Tomcat의 기본 포트 8080 노출
#EXPOSE 8080
#
## 컨테이너 시작 시 Tomcat 실행( 기본 CMD가 이미 정의되어 있으므로 일반적으로 명시하지 않아도 됨)
## CMD["catalina.sh", "run]