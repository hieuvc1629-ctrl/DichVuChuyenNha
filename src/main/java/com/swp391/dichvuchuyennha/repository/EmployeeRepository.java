package com.swp391.dichvuchuyennha.repository;

import com.swp391.dichvuchuyennha.dto.response.EmployeeDTO;
import com.swp391.dichvuchuyennha.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Integer> {
    @Query("""
    SELECT new com.swp391.dichvuchuyennha.dto.response.EmployeeDTO(
        e.employeeId,
        u.username,
        e.position
    )
    FROM Employee e
    LEFT JOIN e.user u
""")
    List<EmployeeDTO> findAllEmployeeDTO();
}