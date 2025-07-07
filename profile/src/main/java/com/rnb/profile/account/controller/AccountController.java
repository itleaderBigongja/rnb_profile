// src/main/java/com/rnbsoft/account/controller/AccountController.java
package com.rnb.profile.account.controller;

import com.rnb.profile.account.domain.dto.RegisterRequestDto;
import com.rnb.profile.account.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    // 아이디 중복 확인 엔드포인트
    // 프론트엔드: http://localhost:8081/api/account/check-id?userId={formData.id}
    @GetMapping("/account/check-id")
    public ResponseEntity<?> checkIdDuplication(@RequestParam("id") String id) {
        Map<String, Boolean> response = new HashMap<>();
        boolean isDuplicated = accountService.isUserIdDuplicated(id);
        response.put("isDuplicated", isDuplicated);
        return ResponseEntity.ok(response);
    }

    // 회원가입 엔드포인트
    // 프론트엔드: http://localhost:8081/api/account/register (POST)
    @PostMapping("/account/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequestDto request) {
        try {
            accountService.registerUser(request);
            return ResponseEntity.ok("회원가입이 성공적으로 완료되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("회원가입 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    // 아이디 중복 확인 응답을 위한 DTO
    public static class CheckIdResponse {
        private boolean isDuplicated;

        public CheckIdResponse(boolean isDuplicated) {
            this.isDuplicated = isDuplicated;
        }

        public boolean isDuplicated() {
            return isDuplicated;
        }

        public void setDuplicated(boolean duplicated) {
            isDuplicated = duplicated;
        }
    }
}