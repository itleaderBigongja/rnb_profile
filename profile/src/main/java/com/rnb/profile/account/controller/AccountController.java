package com.rnb.profile.account.controller;

import com.rnb.profile.account.domain.dto.LoginRequestDto;
import com.rnb.profile.account.domain.dto.LoginResponseDto;
import com.rnb.profile.account.domain.entity.Account;
import com.rnb.profile.account.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import java.util.Optional;

/**
 *  로그인 요청을 처리하는 REST API 컨트롤러
 *  클라이언트(프론트엔드)의 HTTP 요청을 받아, 비즈니스 로직을 AccountService에 위임하고,
 *  그 결과를 HTTP 응답으로 클라이언트에게 반환
 *
 *  [ 계층 역할 ]
 *  클라이언트 요청을 받고, Service 계층에 비즈니스 로직을 위임한 뒤, 결과를 HTTP 응답으로 포장하여 반환*/
@Controller // 이 클래스가 RESTful API의 컨트롤러임을 나타낸다.
@RequestMapping("/api")  // 이 컨트롤러의 모든 핸들러 메서드에 "/api"라는 기본 경로를 적용
public class AccountController {

    @Autowired
    private AccountService accountService;

    /**
     *  로그인 요청을 처리하는 HTTP POST 엔드포인트
     *  클라이언트가 "http://localhost:8081/api/login" 경로로 POST 요청을 보낼 때 이 메서드가 실행
     *
     *  @param loginRequestDto 클라이언트에서 JSON 형태로 전송한 로그인 요청 본문(아이디, password)
     *                         자동으로 LoginRequestDto 객체를 매핑
     *  @return 로그인 성공 또는 실패에 따른 HTTP 응답(ResponseEntity).
     *  ReponseEntity는 HTTP 상태코드(예: 200 OK, 401 Unauthorized)와 응답 본문을 함께 보낼 수 있게 한다.
     *  */
    @PostMapping("/login")
    public ResponseEntity<?> authenticateAccount(@RequestBody LoginRequestDto loginRequestDto) {

        /*
         * Step 1: AccountService의 authenticate 메서드를 호출하여 사용자 인증을 시도
         *         AccountService는 내부적으로 DB 조회 및 비밀번호 평문 비교 로직을 수행*/
        Optional<Account> authenticateAccount = accountService.authenticate(loginRequestDto);

        /*
         * Step 2: AccountService의 인증 결과에 따라 적절한 HTTP 응답을 구성합니다.*/
        if(authenticateAccount.isPresent()) {

            // 2-1. 인증 성공 시: 인증된 Account 객체를 가져옵니다.
            Account account = authenticateAccount.get();

            // 클라이언트에 보낼 성공 응답 데이터(LoginResponseDto)를 생성합니다.
            // 실제 구현에서는 JWT 토큰 생성 로직이 이 위치에 추가될 수 있습니다.
            LoginResponseDto response = new LoginResponseDto(
                    "로그인 성공!",   // 클라이언트에게 표시할 메시지
                    "your_dummy_token",     // 예시 토큰. 추후 실제 JWT 토큰으로 대체되어야 한다.
                    account.getId(),        // 로그인 성공한 계정의 ID
                    account.getEmail()      // 로그인 성공한 계정의 EMAIL
            );

            // HTTP 상태 코드 200(OK)와 함께 LoginResponse 객체를 응답 본문으로 보냅니다.
            return new ResponseEntity<>(response, HttpStatus.OK);
        }else {
            // HTTP 상태 코드 401( Unauthorized )와 함께 LoginReponse 객체를 응답 본문으로 보냅니다.
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }
}
