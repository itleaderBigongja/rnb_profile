// src/main/java/com/rnbsoft/account/dto/JwtResponseDto.java
package com.rnb.profile.account.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class JwtResponseDto {
    private String token;
    private String type = "Bearer";
    private String message; // 로그인 성공 또는 실패 메시지
}