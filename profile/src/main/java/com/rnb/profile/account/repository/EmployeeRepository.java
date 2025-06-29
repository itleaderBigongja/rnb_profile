package com.rnb.profile.account.repository;

import com.rnb.profile.account.domain.entity.Employee; // 엔티티 경로 변경
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, String> {
    Optional<Employee> findById(String id);
}