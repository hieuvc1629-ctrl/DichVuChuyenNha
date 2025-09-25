package com.swp391.dichvuchuyennha.repository;

import com.swp391.dichvuchuyennha.entity.Requests;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RequestRepository extends JpaRepository<Requests, Integer> {
}


