package com.rnb.profile.account.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;

@Entity                         // 이 클래스가 JPA 엔티티임을 선언
@Table(name = "ACCOUNT_TB")     // 매핑될 데이터베이스 테이블 이름 지정( 대소문자 중요 )
@Data @NoArgsConstructor        // Lombok (Get, Set, 기본 생성자 ) 어노테이션 사용
public class Account {

    @Id
    @Column(name = "ID", nullable = false, length = 60)
    private String id;

    @Column(name = "PASSWORD", nullable = false, length = 60)
    private String password;

    @Column(name = "EMAIL", nullable = false, length = 50)
    private String email;

    @Column(name = "USER_DIV_CODE", nullable = false, length = 30)
    private String userDivCode;

    @Column(name = "USER_DIV_NAME", nullable = false, length = 50)
    private String userDivName;

    @Column(name = "LAST_LOGIN_DT", nullable = false)
    private Date lastLoginDt;

    @Column(name = "FIRST_CREATE_DATE", nullable = false)
    private Date firstCreateDate;

    @Column(name = "FIRST_CREATE_ID", nullable = false, length = 60)
    private String firstCreateId;

    @Column(name = "LAST_UPDATE_DATE", nullable = true)
    private Date lastUpdateDate;

    @Column(name = "LAST_UPDATE_ID", nullable = true, length = 60)
    private String lastUpdateId;
}
