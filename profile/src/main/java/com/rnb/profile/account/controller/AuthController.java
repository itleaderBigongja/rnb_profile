// src/main/java/com/rnbsoft/account/controller/AuthController.java
package com.rnb.profile.account.controller;

import com.rnb.profile.account.domain.dto.LoginRequestDto;
import com.rnb.profile.account.domain.dto.LoginResponseDto;
import com.rnb.profile.account.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;

    // 로그인 엔드포인트
    // 프론트엔드: http://localhost:8081/api/login (POST)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDto loginRequestDto) {
        try {
            LoginResponseDto response = authService.authenticateAndGenerateToken(loginRequestDto.getId(), loginRequestDto.getPassword());
            log.info("Login successful : " + response.getToken() + response.getMessage());
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new LoginResponseDto(null, null, e.getMessage()));
        } catch (Exception e) {
            // 특정 예외 처리 (예: BadCredentialsException)를 여기에 추가할 수 있습니다.
            return ResponseEntity.status(401).body(new LoginResponseDto(null, null, "로그인 실패: 아이디 또는 비밀번호를 확인해주세요."));
        }
    }
}