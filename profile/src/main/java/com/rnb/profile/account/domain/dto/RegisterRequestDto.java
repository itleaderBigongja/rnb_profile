package com.rnb.profile.account.domain.dto;

import lombok.Data;

@Data
public class RegisterRequestDto {
    // ACCOUNT_TB 관련 필드
    private String id;                  // 아이디
    private String password;            // 비밀번호
    private String email;               // 이메일

    // EMPOLYEE_TB 관련 필드
    private String firstName;           // 성
    private String lastName;            // 이름
    private String birthday;            // 생년월일('YYYY-MM-DD')
    private String phoneNumber;         // 전화번호
    private String address;             // 주소
    private String abilityLevel;        // 기술등급
    private String workCareer;          // 근무경력( 신입, 1년, 3년, 10년 등)
}
