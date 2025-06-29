package com.rnb.profile;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import java.util.Base64;

public class JwtSecretGenerator {

    public static void main(String[] args) throws Exception{
        // HMAC-SHA256 알고리즘에 사용할 256비트(32바이트) 키 생성
        KeyGenerator keyGen = KeyGenerator.getInstance("HmacSHA256");
        keyGen.init(256);   // 256비트 = 32바이트
        SecretKey secretKey = keyGen.generateKey();

        // 생성된 바이트 배열 키를 Base64로 인코딩하여 문자열로 변환
        String encodedKey = Base64.getEncoder().encodeToString(secretKey.getEncoded());
        System.out.println("--------------------------------------------------");
        System.out.println("Generated JWT Secret Key (생성된 시크릿 Key application.yml에 저장):");
        System.out.println(encodedKey);
        System.out.println("--------------------------------------------------");
    }
}
