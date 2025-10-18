package com.swp391.dichvuchuyennha.repository;

import com.swp391.dichvuchuyennha.entity.Surveys;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SurveyRepository extends JpaRepository<Surveys, Integer> {
    List<Surveys> findByRequest_AssignedEmployees_Employee_User_Username(String username);

}
