// src/main/frontend/vite.config.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()], // React 플러그인 사용 설정
  server: {
    port: 3000, // React 개발 서버의 포트. Spring Boot(8090)와 충돌하지 않게 설정.
               // 이 포트는 React 앱을 개발할 때 브라우저에서 접근하는 주소가 됩니다 (예: http://localhost:3000)
    proxy: {
      // '/api'로 시작하는 모든 요청을 Spring Boot 백엔드로 프록시 설정
      // 개발 중에 React 앱이 http://localhost:3000 에서 실행되고,
      // Spring Boot 앱이 http://localhost:8090 에서 실행될 때 CORS 문제를 피하기 위함.
      // 예: React 코드에서 fetch('/api/users') 호출 시,
      // 실제로는 http://localhost:8080/users 로 요청이 전달됩니다.
      '/api': {
        target: 'http://localhost:8090', // Spring Boot 백엔드 주소 (기본 8090)
        changeOrigin: true,             // 호스트 헤더 변경: 대상 서버(백엔드)의 Origin으로 요청이 전송되도록 변경
        rewrite: (path) => path.replace(/^\/api/, ''), // 요청 경로에서 '/api' 접두사 제거
                                                       // 예: /api/users -> /users
      },
      // 필요한 경우 다른 백엔드 API 접두사에 대한 프록시도 추가할 수 있습니다.
      // 예: 인증 관련 API가 /auth로 시작한다면:
      // '/auth': {
      //   target: 'http://localhost:8090',
      //   changeOrigin: true,
      // },
    },
  },
  build: {
    // !!! 이 부분이 가장 중요합니다 !!!
    // React 앱 빌드 결과물(정적 파일들: index.html, CSS, JavaScript)이 생성될 경로를 지정합니다.
    // Spring Boot는 JAR 파일 내부의 'target/classes/static' 폴더를 웹 리소스의 기본 경로로 인식하고 서빙합니다.
    // 따라서 React 빌드 결과물이 이 경로에 생성되어야 Spring Boot JAR에 함께 묶여 배포될 수 있습니다.
    // '../../target/classes/static' 경로는 src/main/frontend 에서 Spring Boot 프로젝트 루트를 거쳐
    // 최종 빌드 경로로 이동하는 상대 경로입니다.
    outDir: '../../target/classes/static',
    emptyOutDir: true, // 빌드 시 이전 빌드 결과물 폴더를 비워 깨끗하게 시작합니다 (권장).
  }
});
