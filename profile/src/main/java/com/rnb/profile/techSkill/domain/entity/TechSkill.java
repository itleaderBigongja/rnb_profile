package com.rnb.profile.techSkill.domain.entity;

import com.rnb.profile.account.domain.entity.Account;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "TECH_SKILL_TB")
@Data
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class TechSkill {

    @Id
    @Column(name = "ID", nullable = false, length = 60)
    private String id;

    @Id
    @Column(name = "TECH_SEQ_NO", nullable = false, length = 60)
    private String techSeqNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID", referencedColumnName = "ID", nullable = false)
    private Account account; // Account 엔티티 객체 참조 // 연관관계의 주인

    @Column(name = "TECH_DIV_CODE", nullable = false, length = 30)
    private String techDivCode;

    @Column(name = "TECH_DIV_NAME", nullable = false, length = 50)
    private String techDivName;

    @Column(name = "SKILL_LEVEL", nullable = false, length = 3)
    private String skillLevel;

    @Column(name = "REMARKS", nullable = true, length = 100)
    private String remarks;

    @Column(name = "FIRST_CREATE_DATE", nullable = false)
    private LocalDateTime firstCreateDate;

    @Column(name = "FIRST_CREATE_ID", nullable = false, length = 60)
    private String firstCreateId;

    @Column(name = "LAST_UPDATE_DATE", nullable = true)
    private LocalDateTime lastUpdateDate;

    @Column(name = "LAST_UPDATE_ID", nullable = true, length = 60)
    private String lastUpdateId;
}
