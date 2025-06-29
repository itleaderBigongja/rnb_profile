package com.rnb.profile.account.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;


@Entity
@Table(name = "EMPLOYEE_TB")
@Data
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Employee {

    @Id
    @Column(name = "ID", nullable = false, length = 60)
    // @MapsId에 의해 Account의 ID를 상속받으므로, ID에 대한 setter는 제공하지 않는 것이 좋습니다.
    // @Data 대신 @Getter/@Setter를 개별 적용하거나, @Setter(AccessLevel.NONE)을 사용할 수 있습니다.
    // 여기서는 @Data를 유지하되, 이 필드의 수동 설정 방지에 초점을 맞춥니다.
    private String id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID", referencedColumnName = "ID")
    @MapsId // Account의 ID를 Employee의 PK로 사용
    private Account account; // 연관관계의 주인

    @Column(name = "FIRST_NAME", nullable = false, length = 10)
    private String firstName;

    @Column(name = "LAST_NAME", nullable = false, length = 20)
    private String lastName;

    @Column(name = "BIRTHDAY", nullable = false, length = 10)
    private String birthday;

    @Column(name = "PHONE_NUMBER", nullable = false, length = 13)
    private String phoneNumber;

    @Column(name = "ZIP_NO", nullable = false, length = 30)
    private String zipNo;

    @Column(name = "ADDRESS", nullable = false, length = 99)
    private String address;

    @Column(name = "ADDRESS_DTL", nullable = true, length = 30)
    private String addressDtl;

    @Column(name = "ADDRESS_DIV_CODE", nullable = false, length = 30)
    private String addressDivCode;

    @Column(name = "ABILITY_LEVEL", nullable = false, length = 6)
    private String abilityLevel;

    @Column(name = "WORK_CAREER", nullable = false, length = 5)
    private String workCareer;

    @Column(name = "HIRE_DATE", nullable = true, length = 10)
    private String hireDate;

    @Column(name = "EMP_TYPE", nullable = true, length = 12)
    private String empType;

    @Column(name = "FIRST_CREATE_DATE", nullable = false)
    private LocalDateTime firstCreateDate;

    @Column(name = "FIRST_CREATE_ID", nullable = false, length = 60)
    private String firstCreateId;

    // 추가 필드 (원래 코드에서 누락된 부분 - 필요하면 추가)
    @Column(name = "LEAVE_DATE", nullable = true, length = 10)
    private String leaveDate;

    @Column(name = "DEPT_GROUP_CODE", nullable = true, length = 30)
    private String deptGroupCode;

    @Column(name = "DEPT_CODE", nullable = true, length = 30)
    private String deptCode;

    @Column(name = "ON_LEAVE_YN", nullable = true, length = 1)
    private String onLeaveYn;

    @Column(name = "RETENTION_START_DATE", nullable = true, length = 10)
    private String retentionStartDate;

    @Column(name = "RETENTION_END_DATE", nullable = true, length = 10)
    private String retentionEndDate;

    @Column(name = "LAST_UPDATE_DATE", nullable = true)
    private LocalDateTime lastUpdateDate;

    @Column(name = "LAST_UPDATE_ID", nullable = true, length = 60)
    private String lastUpdateId;


    @Builder
    public Employee(Account account, String id, String firstName, String lastName, String birthday,
                    String phoneNumber, String zipNo, String address, String addressDtl,
                    String addressDivCode, String abilityLevel, String workCareer, String hireDate,
                    String empType, // empType도 빌더 인자로 받도록 (null 전달 가능)
                    String leaveDate, String deptGroupCode, String deptCode,
                    String onLeaveYn, String retentionStartDate, String retentionEndDate) { // 추가된 필드도 인자로 받음
        this.account = account;
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.birthday = birthday;
        this.phoneNumber = phoneNumber;
        this.zipNo = zipNo;
        this.address = address;
        this.addressDtl = addressDtl;
        this.addressDivCode = addressDivCode;
        this.abilityLevel = abilityLevel;
        this.workCareer = workCareer;
        this.hireDate = hireDate;
        this.empType = empType; // 빌더를 통해 전달받은 empType
        this.leaveDate = leaveDate;
        this.deptGroupCode = deptGroupCode;
        this.deptCode = deptCode;
        this.onLeaveYn = onLeaveYn;
        this.retentionStartDate = retentionStartDate;
        this.retentionEndDate = retentionEndDate;
    }

    // Account에서 setEmployee(this)를 호출할 때 Employee의 ID가 설정되도록 함
    // @MapsId를 사용하는 경우 이 메서드는 필수적입니다.
    public void setAccount(Account account) {
        this.account = account;
        if (account != null) {
            // @MapsId에 의해 이 시점에서 ID가 설정되어야 함
            this.id = account.getId(); // 명시적으로 Account의 ID를 Employee의 ID로 설정 (안전성 증대)
            if (account.getEmployee() != this) {
                account.setEmployee(this); // 무한 루프 방지
            }
        }
    }

    @PrePersist
    protected void onCreate() {
        if (this.firstCreateDate == null) {
            this.firstCreateDate = LocalDateTime.now();
        }
        if (this.firstCreateId == null) {
            // this.id는 @MapsId에 의해 Account.id와 동일하게 설정됩니다.
            // 이 시점에서는 이미 id가 설정되어 있으므로 사용 가능합니다.
            this.firstCreateId = this.id;
        }
        if(this.onLeaveYn == null || this.onLeaveYn.isEmpty()) {
            this.onLeaveYn = "N";
        }

        // empType 결정 로직
        if (this.hireDate != null && !this.hireDate.isEmpty()) {
            try {
                LocalDate hire = LocalDate.parse(this.hireDate, DateTimeFormatter.ofPattern("yyyy-MM-dd"));
                LocalDate today = LocalDate.now();
                if (hire.plusMonths(3).isAfter(today)) {
                    this.empType = "계약직";
                } else {
                    this.empType = "정규직(조건충족)";
                }
            } catch (Exception e) {
                System.err.println("Error parsing hireDate: " + this.hireDate + ". Setting empType to '프리랜서'.");
                this.empType = "프리랜서"; // 파싱 오류 시 기본값
            }
        } else {
            this.empType = "프리랜서"; // hireDate가 없으면 프리랜서
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.lastUpdateDate = LocalDateTime.now();
        if(this.lastUpdateId == null) {
            this.lastUpdateId = this.id;
        }
    }
}