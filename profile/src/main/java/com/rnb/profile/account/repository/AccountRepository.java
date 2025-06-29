package com.rnb.profile.account.repository;


import com.rnb.profile.account.domain.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long> {

    // ==== 아이디 중복 확인 ====
    // JpaRepository에 이미 existsById(String id) 메서드 제공
    // 따라서 별도의 @Query나 findById().isPresent() 같은 로직은 서비스 계층에서 existsById를 호출하면 됩니다.
    // 예시: boolean isExist = accountRepository.existsById(id);

    // ID로 계쩡 정보 조회(로그인 시 사용자 정보 로드에 사용)
    Optional<Account> findById(String id);
}