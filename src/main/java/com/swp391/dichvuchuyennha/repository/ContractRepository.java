package com.swp391.dichvuchuyennha.repository;

import com.swp391.dichvuchuyennha.entity.Contract;
import com.swp391.dichvuchuyennha.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface ContractRepository extends JpaRepository<Contract, Integer> {
    List<Contract> findByOwnerAndStatus(Users owner, String status);

}
