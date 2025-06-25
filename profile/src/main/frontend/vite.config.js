import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,                             // React 개발 서버 포트를 3000으로 설정합니다.
    proxy: {
      'api': {                              // /api로 시작하는 모든 요청을 프록시합니다.
        target: 'http://localhost:8081',    // 백엔드(Tomcat)주소
        changeOrigin:true,                  // 대상 서버의 호스트 헤더를 변경하여 CROS 문제를 회피합니다.
        // '/api' 접두사를 제거하고 백엔드로 전달합니다.
        rewrite: (path) => path.replace(/^\/api/, ''),
      }
    }
  }
})
