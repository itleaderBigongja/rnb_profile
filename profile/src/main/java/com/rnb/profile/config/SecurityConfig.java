//package com.rnb.profile.config;

//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

//@Configuration      // 이 클래스가 Spring의 설정 클래스임을 나타냅니다.
//public class SecurityConfig {
//
//    /* BCryptPasswordEncoder를 스프링 빈으로 등록
//     * 이 빈은 애플리케이션 전반에서 비밀번호를 안전하게 암호화하고, 검증하는 데 사용
//     * (예: 회원가입 시 비밀번호 암호화, 로그인 시 비밀번호와 DB 비밀번호 비교)
//     * @return BCryptPasswordEncoder 인스턴스
//     * */
//    @Bean
//    public BCryptPasswordEncoder bCryptPasswordEncoder() {
//        return new BCryptPasswordEncoder();
//    }
//}
