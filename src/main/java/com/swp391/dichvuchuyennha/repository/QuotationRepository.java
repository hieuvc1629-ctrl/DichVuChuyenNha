package com.swp391.dichvuchuyennha.repository;

import com.swp391.dichvuchuyennha.entity.Quotations;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuotationRepository extends JpaRepository<Quotations, Integer> {
    // Có thể thêm query theo surveyId nếu cần
}
