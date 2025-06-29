package com.rnb.profile.account.service;

import com.rnb.profile.account.domain.entity.Employee;
import com.rnb.profile.account.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    /**
     * @Description 새로운 직원(개인) 정보를 저장
     * @param employee 저장할 Employee 엔티티
     * @return 저장된 Employee 엔티티
     */
    @Transactional
    public Employee saveEmployee(Employee employee) {
        // Employee 엔티티의 @PrePersist에서 firstCreateDate, firstCreateId, hireDate, onLeaveYn, empType 등이 설정됩니다.
        // Account와의 연관관계는 DTO에서 이미 설정되어 넘어올 것으로 예상됩니다.
        return employeeRepository.save(employee);
    }

    /**
     * @Description ID로 직원(개인) 정보 조회
     * @param id 조회할 직원 아이디 (Account ID와 동일)
     * @return 조회된 Employee 엔티티
     * @throws IllegalArgumentException 직원이 존재하지 않을 경우
     */
    public Employee findEmployeeById(String id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 직원 정보입니다. ID: " + id));
    }
}