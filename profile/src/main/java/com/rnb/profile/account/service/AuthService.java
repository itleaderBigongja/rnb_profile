// src/main/java/com/rnbsoft/account/service/AuthService.java
package com.rnb.profile.account.service;

import com.rnb.profile.account.domain.dto.LoginResponseDto;
import com.rnb.profile.account.domain.entity.Account; // 패키지 이름 조정
import com.rnb.profile.account.repository.AccountRepository;
import com.rnb.profile.common.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.User; // Spring Security User 클래스
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Collections; // Collections.emptyList() 사용

@Service
@RequiredArgsConstructor
public class AuthService implements UserDetailsService {

    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    /**
     * Spring Security의 UserDetailsService 인터페이스 구현.
     * 인증을 위해 DB에서 사용자 정보를 로드합니다.
     *
     * @param username 로그인 시도 중인 사용자 ID
     * @return UserDetails 객체 (여기서는 Account 엔티티가 UserDetails로 변환됨)
     * @throws UsernameNotFoundException 주어진 ID의 사용자를 찾을 수 없는 경우
     */
    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Account account = accountRepository.findById(username)
                .orElseThrow(() -> new UsernameNotFoundException("아이디를 찾을 수 없습니다: " + username));
        // UserDetails 객체 생성 (Spring Security의 User 클래스 사용)
        // 참고: 권한은 현재 비어 있으며, 나중에 역할/권한을 추가할 수 있습니다.
        return new User(account.getId(), account.getPassword(), Collections.emptyList());
    }

    // 로그인 및 토큰 생성
    @Transactional
    // authenticateAndGenerateToken 메서드 수정
    public LoginResponseDto authenticateAndGenerateToken(String id, String rawPassword) {
        // 1. 사용자 ID로 Account 엔티티 조회
        // findById 또는 findByUserId 등 Account 엔티티에서 ID를 찾는 메서드 사용
        // 여기서는 Account 엔티티의 필드명이 'id'이므로 findById(userId)를 가정합니다.
        // 만약 Account 엔티티에 userId 필드가 별도로 있다면 accountRepository.findByUserId(userId)를 사용하세요.
        Account account = accountRepository.findById(id) // 또는 accountRepository.findByUserId(userId)
                .orElseThrow(() -> new BadCredentialsException("아이디 또는 비밀번호를 확인해주세요."));
        // DB에 사용자가 없으면 BadCredentialsException 발생 -> Controller에서 401 처리

        // 2. 입력된 비밀번호(rawPassword)와 DB에 저장된 암호화된 비밀번호(account.getPassword()) 비교
        // passwordEncoder.matches(평문비밀번호, 암호화된비밀번호)
        if (!passwordEncoder.matches(rawPassword, account.getPassword())) {
            throw new BadCredentialsException("아이디 또는 비밀번호를 확인해주세요.");
            // 비밀번호가 일치하지 않으면 BadCredentialsException 발생 -> Controller에서 401 처리
        }

        // 3. 비밀번호가 일치하면 로그인 성공 처리 및 토큰 생성 (JWT 등의 로직 추가)
        // 이 부분은 실제 프로젝트의 인증 및 토큰 발급 로직에 따라 달라집니다.
        // 예시: JWT 토큰 생성 로직
        String token = "xmccQLOogu0UoxGPk8TUSZDMRk0J/ucMiFyxih9h7Yw="; // 실제 토큰 생성 로직으로 대체
        String message = "로그인 성공!";

        return new LoginResponseDto(token, account.getId(), message);
    }
}