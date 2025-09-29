package com.swp391.dichvuchuyennha.repository;

import com.swp391.dichvuchuyennha.entity.Surveys;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SurveyRepository extends JpaRepository<Surveys, Integer> {
    // Có thể thêm các query nếu cần lọc theo surveyStatus, requestId
}
