package com.rnb.profile.account.domain.dto;

import lombok.*;

/**
 * 클라이언트(프론트엔드)로부터 로그인 요청 시 받는 데이터를 정의하는 DTO(Data Transfer Object).
 * HTTP 요청의 JSON 본문이 이 객체로 자동 매핑*/
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequestDto {

    /**
     * 사용자가 입력한 계정 아이디
     * 프론트엔드의 로그인 폼에서 'id'이라는 이름으로 전송
     * 백엔드에서는 이 'Id' 값을 사용하여 DB의 'ACCOUNT_TB.ID' 컬럼을 조회*/
    private String id;

    /**
     * 사용자가 입력한 비밀번호( 평문 ), 프론트엔드의 <input name="password">와 매핑
     * 백엔드에서는 이 값을 DB에 저장된 평문 비밀번호와 비교( 추후 암호화된 비밀번호와 비교해야 함 )*/
    private String password;
}
