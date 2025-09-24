package com.swp391.dichvuchuyennha.repository;

import com.swp391.dichvuchuyennha.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Integer> {
}
