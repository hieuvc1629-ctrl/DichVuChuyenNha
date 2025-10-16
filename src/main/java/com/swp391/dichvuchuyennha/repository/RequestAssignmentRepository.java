package com.swp391.dichvuchuyennha.repository;


import com.swp391.dichvuchuyennha.entity.RequestAssignment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RequestAssignmentRepository  extends JpaRepository<RequestAssignment, Integer> {
    List<RequestAssignment> findByEmployee_EmployeeId(Integer employeeId);

}
