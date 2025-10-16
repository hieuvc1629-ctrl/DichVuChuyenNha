package com.swp391.dichvuchuyennha.repository;

import com.swp391.dichvuchuyennha.entity.Surveys;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SurveyRepository extends JpaRepository<Surveys, Integer> {
    @Query("""
        SELECT DISTINCT s
        FROM Surveys s
        JOIN s.request r
        JOIN r.assignedEmployees ra
        JOIN ra.employee e
        JOIN e.user u
        WHERE u.username = :username
    """)
    List<Surveys> findByAssignedEmployeeUsername(@Param("username") String username);
    // Có thể thêm các query nếu cần lọc theo surveyStatus, requestId
}
