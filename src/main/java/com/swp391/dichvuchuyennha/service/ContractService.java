package com.swp391.dichvuchuyennha.service;

import com.swp391.dichvuchuyennha.dto.response.ContractResponse;
import com.swp391.dichvuchuyennha.entity.Contract;
import com.swp391.dichvuchuyennha.entity.Users;
import com.swp391.dichvuchuyennha.repository.ContractRepository;
import com.swp391.dichvuchuyennha.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ContractService {

    private final ContractRepository contractRepository;
    private final UserRepository userRepository;


    public ContractResponse toResponse(Contract contract) {
        return ContractResponse.builder()
                .contractId(contract.getContractId())
                .startDate(contract.getStartDate())
                .endDate(contract.getEndDate())
                .depositAmount(contract.getDepositAmount())
                .totalAmount(contract.getTotalAmount())
                .status(contract.getStatus())
                .signedDate(contract.getSignedDate())
                .ownerId(contract.getOwner().getUserId())
                .ownerUsername(contract.getOwner().getUsername())
                .signedById(contract.getSignedBy() != null ? contract.getSignedBy().getUserId() : null)
                .signedByUsername(contract.getSignedBy() != null ? contract.getSignedBy().getUsername() : null)
                .build();
    }

    // Lấy danh sách hợp đồng chưa ký của user
    public List<ContractResponse> getUnsignedContracts(Integer userId) {
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Contract> contracts = contractRepository.findByOwnerAndStatus(user, "unsigned");

        return contracts.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // Ký hợp đồng
    public ContractResponse signContract(Integer contractId, Integer userId) {
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new RuntimeException("Contract not found"));

        if (!contract.getOwner().getUserId().equals(userId)) {
            throw new RuntimeException("User not authorized to sign this contract");
        }

        contract.setStatus("signed");
        contract.setSignedBy(user);
        contract.setSignedDate(LocalDateTime.now());

        Contract saved = contractRepository.save(contract);
        return toResponse(saved);
    }
}
