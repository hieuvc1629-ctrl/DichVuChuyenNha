package com.swp391.dichvuchuyennha.service;

import com.swp391.dichvuchuyennha.dto.response.ContractResponse;
import com.swp391.dichvuchuyennha.dto.response.EmployeeDTO;
import com.swp391.dichvuchuyennha.entity.Contract;
import com.swp391.dichvuchuyennha.entity.Users;
import com.swp391.dichvuchuyennha.mapper.ContractMapper;
import com.swp391.dichvuchuyennha.repository.ContractRepository;
import com.swp391.dichvuchuyennha.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ContractService {

    private final ContractRepository contractRepository;
    private final UserRepository userRepository;
    private final ContractMapper contractMapper; // inject mapper

    @Transactional(readOnly = true)
    public List<ContractResponse> getUnsignedContracts(Integer userId) {
        List<Contract> contracts =
                contractRepository.findByQuotation_Survey_Request_User_UserIdAndStatus(userId, "UNSIGNED");

        return contracts.stream()
                .map(contractMapper::toResponse)  // dùng mapper
                .toList();
    }

    @Transactional
    public ContractResponse signContract(Integer contractId, Integer userId) {
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new RuntimeException("Contract not found"));

        Users owner = contract.getQuotation().getSurvey().getRequest().getUser();
        if (!owner.getUserId().equals(userId)) {
            throw new RuntimeException("User not authorized to sign this contract");
        }

        if (!"UNSIGNED".equalsIgnoreCase(contract.getStatus())) {
            throw new RuntimeException("Contract already signed or invalid status");
        }

        contract.setStatus("SIGNED");
        contract.setSignedBy(user);
        contract.setSignedDate(LocalDateTime.now());

        Contract saved = contractRepository.save(contract);
        return contractMapper.toResponse(saved); // mapper xử lý
    }
}


