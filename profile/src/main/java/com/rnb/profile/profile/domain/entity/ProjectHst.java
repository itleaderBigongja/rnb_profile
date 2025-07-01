package com.rnb.profile.profile.domain.entity;

import com.rnb.profile.account.domain.entity.Account;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "PRJ_HST_TB")
@Data
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProjectHst {

    @Id
    @Column(name = "ID", nullable = false, length = 60)
    private String id;

    @Id
    @Column(name = "PRJ_SEQ_NO", nullable = false, length = 10, unique = true)
    private String prjSeqNo;

    // @MapsId, @OneToOne 관계에서 부모 엔티티의 PK를 자식 엔티티의 PK로 매핑할 때 사용
    // 이렇게 되면 ProjectHst 엔티티의 ID 필드는 Account 엔티티의 ID와 동일한 값을 갑니다.
    @ManyToOne(fetch = FetchType.LAZY) // 지연 로딩 권장
    @JoinColumn(name = "ID", referencedColumnName = "ID", nullable = false) // PRI_HIST_TB의 ID 컬럼이 ACCOUNT_TB의 ID를 참조
    @MapsId // Account의 ID를 ProjectHst PK로 사용
    private Account account; // Account 엔티티 객체 참조 // 연관관계의 주인

    @Column(name = "DEPLOY_START_DATE", nullable = true, length = 10)
    private String deployStartDate;

    @Column(name = "DEPLOY_END_DATE", nullable = true, length = 10)
    private String deployEndDate;

    @Column(name = "OS", nullable = true, length = 10)
    private String os;

    @Column(name = "ORDERER_NAME", nullable = true, length = 20)
    private String ordererName;

    @Column(name = "ROLE", nullable = true, length = 20)
    private String role;

    @Column(name = "LANGUAGE", nullable = true, length = 20)
    private String language;

    @Column(name = "FRAMEWORK", nullable = true, length = 20)
    private String framework;

    @Column(name = "DATABASE", nullable = true, length = 20)
    private String database;

    @Column(name = "FIRST_CREATE_DATE", nullable = false)
    private LocalDateTime firstCreateDate;

    @Column(name = "FIRST_CREATE_ID", nullable = false, length = 60)
    private String firstCreateId;

    @Column(name = "LAST_UPDATE_DATE", nullable = true)
    private LocalDateTime lastUpdateDate;

    @Column(name = "LAST_UPDATE_ID", nullable = false)
    private String lastUpdateId;

    @Builder
    public ProjectHst(Account account, String id, String prjSeqNo, String deployStartDate, String deployEndDate, String os
                    , String ordererName, String role, String language, String framework, String database) {
        this.id = id;
        this.prjSeqNo = prjSeqNo;
        this.deployStartDate = deployStartDate;
        this.deployEndDate = deployEndDate;
        this.os = os;
        this.ordererName = ordererName;
        this.role = role;
        this.language = language;
        this.framework = framework;
        this.database = database;
    }

    // Account에서 setProjectHst(this)를 호출할 때 ProjectHst의 ID가 설정되도록 함
    // @MapsId를 사용하는 경우 이 메서드는 필수적이다.
    public void setAccount(Account account) {
        this.account = account;
        if(account != null) {
            // @MapsId에 의해 이 시점에서 ID가 설정되어야 함
            // 명시적으로 Account의 ID를 ProjectHst의 ID로 설정
            this.id = account.getId();
            if(account.getProjectHistories() != this) {
                account.setProjectHistories((List<ProjectHst>) this);
            }
        }
    }


    @PrePersist
    protected void onCreate() {
        if(this.firstCreateDate == null) {
            this.firstCreateDate = LocalDateTime.now();
        }
        if(this.firstCreateId == null) {
            this.firstCreateId = this.id;
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
