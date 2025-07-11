package com.rnb.profile.account.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponseDto {
    private String token;
    private String type = "Bearer"; // 토큰 타입
    private String message; // 로그인 성공 메시지
}