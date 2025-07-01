package com.rnb.profile.profile.domain.entity;

import com.rnb.profile.account.domain.entity.Account;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID", referencedColumnName = "ID")
    @MapsId         // Account의 ID를 Project의 PK로 사용
    private Account account;        // 연관관계의 주인

    @Column(name = "DEPLOY_START_DATE", nullable = true, length = 10)
    private String deployStartDate;

    @Column(name = "DEPLOY_END_DATE", nullable = true, length = 10)
    private String deployEndDate;

    @Column(name = "OS", nullable = true, length = 10)
    private String os; //
}
