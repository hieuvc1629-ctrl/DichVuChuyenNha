package com.swp391.dichvuchuyennha.service;

import com.swp391.dichvuchuyennha.dto.response.ContractResponse;
import com.swp391.dichvuchuyennha.dto.response.EmployeeDTO;
import com.swp391.dichvuchuyennha.entity.Contract;
import com.swp391.dichvuchuyennha.entity.Users;
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

    // Mapping Contract -> ContractResponse
    private ContractResponse toResponse(Contract contract) {
        Users owner = contract.getQuotation().getSurvey().getRequest().getUser();

        // Lấy danh sách nhân viên từ AssignmentEmployee
        List<EmployeeDTO> employees = contract.getAssignmentEmployees().stream()
                .map(a -> new EmployeeDTO(
                        a.getEmployee().getEmployeeId(),
                        a.getEmployee().getUser().getUsername(),
                        a.getEmployee().getPosition()
                ))
                .toList();

        // Lấy địa chỉ đi và đến từ Survey
        String startLocation = contract.getQuotation().getSurvey().getAddressFrom();
        String endLocation = contract.getQuotation().getSurvey().getAddressTo();

        return ContractResponse.builder()
                .contractId(contract.getContractId())
                .startDate(contract.getStartDate())
                .endDate(contract.getEndDate())
                .depositAmount(contract.getDepositAmount())
                .totalAmount(contract.getTotalAmount())
                .status(contract.getStatus())
                .signedDate(contract.getSignedDate())
                .ownerId(owner.getUserId())
                .ownerUsername(owner.getUsername())
                .signedById(contract.getSignedBy() != null ? contract.getSignedBy().getUserId() : null)
                .signedByUsername(contract.getSignedBy() != null ? contract.getSignedBy().getUsername() : null)
                .assignedEmployees(employees)
                .startLocation(startLocation)
                .endLocation(endLocation)
                .build();
    }

    // Lấy tất cả hợp đồng "UNSIGNED" của 1 user
    @Transactional(readOnly = true)
    public List<ContractResponse> getUnsignedContracts(Integer userId) {
        List<Contract> contracts =
                contractRepository.findByQuotation_Survey_Request_User_UserIdAndStatus(userId, "UNSIGNED");

        return contracts.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // User ký 1 hợp đồng
    @Transactional
    public ContractResponse signContract(Integer contractId, Integer userId) {
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new RuntimeException("Contract not found"));

        // Kiểm tra user có phải chủ sở hữu không
        Users owner = contract.getQuotation().getSurvey().getRequest().getUser();
        if (!owner.getUserId().equals(userId)) {
            throw new RuntimeException("User not authorized to sign this contract");
        }

        // Kiểm tra trạng thái hợp đồng
        if (!"UNSIGNED".equalsIgnoreCase(contract.getStatus())) {
            throw new RuntimeException("Contract already signed or invalid status");
        }

        // Cập nhật
        contract.setStatus("SIGNED");
        contract.setSignedBy(user);
        contract.setSignedDate(LocalDateTime.now());

        Contract saved = contractRepository.save(contract);
        return toResponse(saved);
    }
}
