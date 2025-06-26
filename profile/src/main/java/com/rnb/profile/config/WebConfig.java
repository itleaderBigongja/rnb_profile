package com.rnb.profile.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")                                    // /api로 시작하는 모든 URL경로에 대해 CORS 적용
                .allowedOrigins("http://localhost:3000", "http://127.0.0.1:3000")  // 프론트엔드(React) 개발 서버의 포트를 명시
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")    // 허용할 HTTP 메서드들을 지정한다. (OPTIONS 추가 권장)
                .allowedHeaders("*")                                               // 모든 헤더를 허용한다.
                .allowCredentials(true); // 자격 증명(쿠키, HTTP 인증 등)을 함께 보낼 수 있도록 허용
    }
}
