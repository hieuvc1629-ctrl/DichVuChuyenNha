package com.swp391.dichvuchuyennha.repository;

import com.swp391.dichvuchuyennha.dto.response.EmployeeDTO;
import com.swp391.dichvuchuyennha.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

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
<<<<<<< HEAD

=======
>>>>>>> 50d3ace9be4f20731befc6c501569bf0a7dae5b1
    // 🔎 Thêm hàm này để tìm nhân viên từ userId trong JWT
    Optional<Employee> findByUser_UserId(Long userId);

    // employee sau khi bỏ của dũng
    @Query("""
    SELECT new com.swp391.dichvuchuyennha.dto.response.EmployeeDTO(
        e.employeeId,
        u.username,
        e.position
    )
    FROM Employee e
    LEFT JOIN e.user u
    WHERE e.status = 'free'
""")
    List<EmployeeDTO> findFreeEmployeeDTO();
}