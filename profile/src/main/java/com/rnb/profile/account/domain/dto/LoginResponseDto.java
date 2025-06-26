package com.rnb.profile.account.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * 백엔드에서 클라이언트(프론트엔드)로 로그인 응답 시 전달되는 데이터를 담는 DTO.
 * 로그인 성공/실패 메시지, 인증 토큰(예시), 사용자ID 등을 포함 */
@Data
@AllArgsConstructor
public class LoginResponseDto {

    /**
     * 로그인 처리 결과에 대한 메시지(예: "로그인 성공!", "아이디 또는 비밀번호가 일치하지 않습니다."*/
    private String message;

    /**
     * 인증 성공 시 발급될 JWT( JSON Web Token ) 등의 토큰입니다.
     * 현재는 예시 문자열이며, 실제 구현에서는 JWT 생성 로직이 필요 */
    private String token;

    /**
     * 로그인에 성공한 계쩡의 고유 아이디(ACCOUNT_TB의 ID 컬럼 값.)
     * 클라이언트에서 이 ID를 사용하여 사용자별 데이터를 처리 */
    private String id;

    /**
     * 로그인에 성공한 계정의 이메일 주소( ACCOUNT_TB의 EMAIL 컬럼 값 )
     * 사용자 편의를 위해 함꼐 전달 */
    private String email;
}
