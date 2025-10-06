package com.swp391.dichvuchuyennha.repository;

import com.swp391.dichvuchuyennha.dto.response.EmployeeDTO;
import com.swp391.dichvuchuyennha.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Integer> {
    
    @Query("""
    SELECT new com.swp391.dichvuchuyennha.dto.response.EmployeeDTO(
        e.employeeId,
        u.userId,
        u.username,
        u.email,
        e.phone,
        e.position,
        e.status
    )
    FROM Employee e
    LEFT JOIN e.user u
    ORDER BY e.employeeId
""")
    List<EmployeeDTO> findAllEmployeeDTO();
    
    // Find employee by user ID
    Optional<Employee> findByUserUserId(Integer userId);
    
    // Find employees by status
    List<Employee> findByStatus(String status);
    
    // Find employees by position
    List<Employee> findByPosition(String position);
    
    // Find employee with user information
    @Query("""
        SELECT e FROM Employee e
        LEFT JOIN FETCH e.user u
        WHERE e.employeeId = :employeeId
    """)
    Optional<Employee> findByIdWithUser(@Param("employeeId") Integer employeeId);
    
    // Find all employees with user information
    @Query("""
        SELECT e FROM Employee e
        LEFT JOIN FETCH e.user u
        ORDER BY e.employeeId
    """)
    List<Employee> findAllWithUser();
}