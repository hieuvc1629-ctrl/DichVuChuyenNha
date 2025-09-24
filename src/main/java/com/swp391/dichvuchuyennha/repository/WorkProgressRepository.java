package com.swp391.dichvuchuyennha.repository;

import com.swp391.dichvuchuyennha.entity.WorkProgress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WorkProgressRepository extends JpaRepository<WorkProgress, Integer> {
    List<WorkProgress> findByContract_ContractId(Integer contractId);
}
