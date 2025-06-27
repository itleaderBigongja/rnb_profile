package com.rnb.profile.account.domain.entity;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;

@Entity                         // 이 클래스가 JPA 엔티티임을 선언
@Table(name = "EMPLOYEE_TB")    // 매핑될 데이터베이스 테이블 이름 지정( 대소문자 중요 )
@Data
@NoArgsConstructor              // Lombok (Get, Set, 기본 생성자 ) 어노테이션 사용
public class Employee {

    @Id
    @Column(name = "ID", nullable = false, length = 60)
    private String id;

    @Column(name = "FIRST_NAME", nullable = false, length = 10)
    private String firstName;

    @Column(name = "LAST_NAME", nullable = false, length = 20)
    private String lastName;

    @Column(name = "BIRTHDAY", nullable = false, length = 10)
    private String birthday;

    @Column(name = "PHONE_NUMBER", nullable = false, length = 13)
    private String phoneNumber;

    @Column(name = "ADDRESS", nullable = false, length = 99)
    private String address;

    @Column(name = "ABILITY_LEVEL", nullable = false, length = 6)
    private String abilityLevel;

    @Column(name = "WORK_CAREER", nullable = false, length = 5)
    private String workCareer;

    @Column(name = "HIRE_DATE", nullable = false, length = 10)
    private String hireDate;

    @Column(name = "LEAVE_DATE", nullable = true, length = 10)
    private String leaveDate;

    @Column(name = "DEPT_GROUP_CODE", nullable = true, length = 30)
    private String deptGroupCode;

    @Column(name = "DEPT_CODE", nullable = true, length = 30)
    private String deptCode;

    @Column(name = "ON_LEAVE_YN", nullable = true, length = 1)
    private String onLeaveYn;

    @Column(name = "EMP_TYPE", nullable = false, length = 12)
    private String empType;

    @Column(name = "RETENTION_START_DATE", nullable = true, length = 10)
    private String retentionStartDate;

    @Column(name = "RETENTION_END_DATE", nullable = true, length = 10)
    private String retentionEndDate;

    @Column(name = "FIRST_CREATE_DATE", nullable = false)
    private Date firstCreateDate;

    @Column(name = "FIRST_CREATE_ID", nullable = false, length = 60)
    private String firstCreateId;

    @Column(name = "LAST_UPDATE_DATE", nullable = true)
    private Date lastUpdateDate;

    @Column(name = "LAST_UPDATE_ID", nullable = true, length = 60)
    private String lastUpdateId;
}
