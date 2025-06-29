package com.rnb.profile.account.domain.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime; // LocalDateTime import

@Entity
@Table(name = "ACCOUNT_TB")
@Data
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Account {

    @Id
    @Column(name = "ID", nullable = false, length = 60)
    private String id; // Account의 PK는 id

    @Column(name = "PASSWORD", nullable = false, length = 60)
    private String password;

    @Column(name = "EMAIL", nullable = false, length = 50)
    private String email;

    @Column(name = "USER_DIV_CODE", nullable = false, length = 30)
    private String userDivCode;

    @Column(name = "USER_DIV_NAME", nullable = false, length = 50)
    private String userDivName;

    @Column(name = "FIRST_CREATE_DATE", nullable = false)
    private LocalDateTime firstCreateDate; // java.sql.Date -> LocalDateTime 변경 (권장)

    @Column(name = "FIRST_CREATE_ID", nullable = false, length = 60)
    private String firstCreateId;

    // 추가 필드 (원래 코드에서 누락된 부분 - 필요하면 추가)
    @Column(name = "LAST_LOGIN_DT")
    private LocalDateTime lastLoginDt;

    @Column(name = "LAST_UPDATE_DATE")
    private LocalDateTime lastUpdateDate;

    @Column(name = "LAST_UPDATE_ID", length = 60)
    private String lastUpdateId;

    @OneToOne(mappedBy = "account", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private Employee employee;

    @Builder
    public Account(String id, String password, String email, String firstCreateId) {
        this.id = id;
        this.password = password;
        this.email = email;
        this.firstCreateId = firstCreateId;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
        if (employee != null) {
            // 무한 루프 방지 (Employee의 setAccount도 이 Account를 설정하므로)
            if (employee.getAccount() != this) {
                employee.setAccount(this);
            }
        }
    }

    @PrePersist
    public void prePersist() {
        if (this.firstCreateDate == null) {
            this.firstCreateDate = LocalDateTime.now(); // Date.valueOf(LocalDate.now()) -> LocalDateTime.now() (권장)
        }

        if (this.firstCreateId == null) {
            this.firstCreateId = this.id;
        }

        // !!! 이 부분의 로직을 변경합니다 !!!
        if (this.id.contains("rnbsoft.com")) { // 또는 항상 "EXTERNAL_USER"로 시작
            this.userDivCode = "INTERNAL_USER";
            this.userDivName = "사내인력유저";
        }else {
            this.userDivCode = "EXTERNAL_USER";
            this.userDivName = "외부인력유저";
        }
    }
}