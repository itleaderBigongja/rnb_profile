// src/main/java/com/rnbsoft/account/dto/RegisterRequestDto.java
package com.rnb.profile.account.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// import java.time.LocalDate; // 제거됨
import java.sql.Date; // 내부적으로 필요할 경우를 위해 추가되었지만, 프론트엔드는 문자열을 보냄

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequestDto {
    // ACCOUNT_TB 필드
    private String id;          // Account.id에 매핑
    private String password;    // Account.password에 매핑
    private String email;       // Account.email에 매핑

    // EMPLOYEE_TB 필드
    private String firstName;   // Employee.firstName에 매핑
    private String lastName;    // Employee.lastName에 매핑
    private String birthday;    // Employee.birthday에 매핑 (프론트엔드에서 보낸 String 타입)
    private String phoneNumber; // Employee.phoneNumber에 매핑
    private String zipNo;       // Employee.zipNo에 매핑
    private String address;     // Employee.address에 매핑
    private String addressDtl;  // Employee.addressDtl에 매핑
    private String addressDivCode; // Employee.addressDivCode에 매핑
    private String hireDate;    // Employee.hireDate에 매핑
    private String abilityLevel; // Employee.abilityLevel에 매핑
    private String workCareer;   // Employee.workCareer에 매핑
}