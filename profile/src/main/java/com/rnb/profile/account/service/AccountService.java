package com.rnb.profile.account.service;

import com.rnb.profile.account.domain.dto.LoginRequestDto;
import com.rnb.profile.account.domain.entity.Account;
import com.rnb.profile.account.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.util.Optional;

/**
 * 로그인과 관련된 핵심 비즈니스 로직을 처리하는 서비스 클래스
 * 이 클래스는 데이터베이스 접근(Repository)을 통해 계정 정보를 조회하고,
 * 사용자가 입력한 비밀번호와 DB에 저장된 비밀번호를 비교하여 인증 과정을 수행
 *
 * [ 계층역할 ]
 * Repository로부터 데이터를 조회하여 비즈니스 규칙(비밀번호 일치 여부)에 따라 인증 여부를 판단
 * 현재는 비밀번호 암호화를 하지 않고 평문으로 직접 비교 */
@Service    // Spring 컨테이너에 서비스 빈으로 등록
public class AccountService {

    // AccountRepository 빈을 주입받아 DB 접근에 사용
    @Autowired
    private AccountRepository accountRepository;

    /**
     * 사용자의 로그인 정보를 받아 인증을 시도하는 메서드
     * @param loginRequestDto 사용자가 입력한 계정 아이디(id)와 비밀번호(password)를 담은 객체
     * @return 인증에 성공하면 해당 Account 객체를 Optional로 감싸 반환하고, 실패하면 Optional.empty()를 반환
     **/
    public Optional<Account> authenticate(LoginRequestDto loginRequestDto) {

        // Step 1: AccountRepository의 findAccountByIdNative 메서드를 사용하여
        //         사용자가 입력한 '계정 아이디(loginRequest.getId())로 ACCOUNT_TB에서 계정 정보를 조회
        //         Repository는 이 시점에서 비밀번호가 맞는지 검증하지 않고, 단지 해당 아이디의 모든 데이터를 가져온다.
        Optional<Account> accountOptional = accountRepository.findAccountByIdNative(loginRequestDto.getId());

        // Step 2: 조회된 계정 정보가 존재하는지 확인
        if(accountOptional.isPresent()) {

            // Optional에서 실제 Account 객체를 꺼낸다.
            // account 객체 안에는 DB에서 가져온 평문 비밀번호가 포함되어 있다.
            Account account = accountOptional.get();

            /**
             * Step 3: 계정이 존재한다면, 이제 '비밀번호'를 검증합니다.*/
            if(account.getPassword().equals(loginRequestDto.getPassword())) {
                // 비밀번호가 일치하면 인증 성공
                return Optional.of(account);
            }
        }

        // Step 4: 계정 아이디가 존재하지 않거나 비밀번호가 일치하지 않으면 인증 실패
        return Optional.empty();
    }
}
