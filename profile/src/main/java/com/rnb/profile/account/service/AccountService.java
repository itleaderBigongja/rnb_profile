// src/main/java/com/rnbsoft/account/service/AccountService.java
package com.rnb.profile.account.service;

import com.rnb.profile.account.domain.dto.RegisterRequestDto;
import com.rnb.profile.account.domain.entity.Account; // 패키지 이름 조정
import com.rnb.profile.account.domain.entity.Employee; // 패키지 이름 조정
import com.rnb.profile.account.repository.AccountRepository;
import com.rnb.profile.account.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder; // Spring Security의 비밀번호 인코더

    // 중복 아이디 확인
    @Transactional(readOnly = true)
    public boolean isUserIdDuplicated(String id) {
        // userId 필드를 가진 Account 엔티티가 존재하는지 확인
        return accountRepository.findById(id).isPresent();
    }

    // 사용자 회원가입 로직
    @Transactional
    public String registerUser(RegisterRequestDto request) {
        // 1. ID 중복 확인
        if (isUserIdDuplicated(request.getId())) {
            throw new IllegalArgumentException("이미 사용 중인 아이디입니다.");
        }

        // 2. 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(request.getPassword());

        // 3. Account 엔티티 생성
        Account account = Account.builder()
                .id(request.getId())
                .password(encodedPassword)
                .email(request.getEmail())
                .firstCreateId(request.getId())
                .build();

        // 4. Employee 엔티티 생성 (ID 설정)
        Employee employee = Employee.builder()
                .account(account)
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .birthday(request.getBirthday())
                .phoneNumber(request.getPhoneNumber())
                .zipNo(request.getZipNo())
                .address(request.getAddress())
                .addressDtl(request.getAddressDtl())
                .addressDivCode(request.getAddressDivCode())
                .abilityLevel(request.getAbilityLevel())
                .workCareer(request.getWorkCareer())
                .hireDate(request.getHireDate())
                .build();

        // 5. 양방향 관계 설정
        account.setEmployee(employee); // 이 메서드 내부에서 employee.setAccount도 호출됨

        // 6. 저장 (CascadeType.ALL에 의해 Employee도 같이 저장됨)
        accountRepository.save(account); // ✅ 핵심 저장 지점

        return "회원가입이 성공적으로 완료되었습니다.";
    }
}