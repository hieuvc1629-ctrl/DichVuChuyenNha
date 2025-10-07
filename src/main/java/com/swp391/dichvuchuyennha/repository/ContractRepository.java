package com.swp391.dichvuchuyennha.repository;

import com.swp391.dichvuchuyennha.entity.Contract;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContractRepository extends JpaRepository<Contract, Integer> {

    // Tìm hợp đồng theo userId của request và trạng thái
    List<Contract> findByQuotation_Survey_Request_User_UserIdAndStatus(Integer userId, String status);
    List<Contract> findByStatus(String status);


}
