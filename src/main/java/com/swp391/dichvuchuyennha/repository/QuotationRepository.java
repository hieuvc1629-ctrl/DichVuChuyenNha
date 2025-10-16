package com.swp391.dichvuchuyennha.repository;

import com.swp391.dichvuchuyennha.entity.Quotations;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuotationRepository extends JpaRepository<Quotations, Integer> {
    // Có thể thêm query theo surveyId nếu cần
// QuotationRepository.java
    @Query("""
        SELECT DISTINCT q
        FROM Quotations q
        JOIN q.survey s
        JOIN s.request r
        JOIN r.assignedEmployees ra
        JOIN ra.employee e
        JOIN e.user u
        WHERE u.username = :username
    """)
    List<Quotations> findByAssignedEmployeeUsername(@Param("username") String username);

}
