package com.rnb.profile.profile.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileResponseDto {

    private String id;                  // 사원 ID( Account.id와 동일 )
    private String name;                // 성명( firstName + lastName )
    private String gender;              // 성별( EMPLOYEE_TB에 필드 없다면 더미 또는 로직으로 처리)
    private String birthDate;           // 생년월일( YYYY-MM-DD )
    private String workExperience;      // 근무경력
    private String position;            // 직급( EMPLOYEE_TB에 없으므로 DTO에서 추가 )
    private String department;          // 부서
    private String techGrade;           // 기술등급

    private String zipNo;               // 우편번호
    private String address;             // 기본 주소
    private String addressDtl;          // 상세 주소
    private String addressDivCode;      // 주소 분류 코드
}