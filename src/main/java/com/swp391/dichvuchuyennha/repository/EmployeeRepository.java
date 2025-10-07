package com.swp391.dichvuchuyennha.repository;

import com.swp391.dichvuchuyennha.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Integer> {

    // 🔎 Thêm hàm này để tìm nhân viên từ userId trong JWT
    Optional<Employee> findByUser_UserId(Long userId);
}