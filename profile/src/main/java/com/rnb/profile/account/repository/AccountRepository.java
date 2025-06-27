package com.rnb.profile.account.repository;


import com.rnb.profile.account.domain.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, String> {

    /** 로그인에서 사용할 메서드
     *  계정 아이디(ID)를 사용하여 'ACCOUNT_TB'에서 계정 정보를 조회하는 Native SQL 쿼리
     *  'nativeQuery = true'로 설정하여 실제 데이터베이스 SQL 문법을 사용
     *
     *  이 메서드는 사용자가 입력한 아이디(id)를 파라미터로 받아,
     *  해당 아이디에 맞는 계정의 모든 정보(ID, PASSWORD, EMAIL 등)를 데이터베이스에 가져와서 사용
     *  @param id 조회할 계정 아이디(로그인 시, 사용자가 입력한 아이디)
     *  @return 일치하는 계정 정보(Optional로 감싸져 반환). 계정이 없으면, 'Optional.empty()'를 반환 */
    @Query(value = """
                   SELECT *
                     FROM ACCOUNT_TB
                    WHERE ID = :id                      /* :id == React 화면에서 id 값을 입력받음 */
                   """, nativeQuery = true)
    Optional<Account> findAccountByIdNative(@Param("id") String id);
}