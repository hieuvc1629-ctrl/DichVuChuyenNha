package com.swp391.dichvuchuyennha.service;

import com.swp391.dichvuchuyennha.dto.request.ContractRequest;
import com.swp391.dichvuchuyennha.dto.response.ContractResponse;
//import com.swp391.dichvuchuyennha.dto.response.EmployeeDTO;
import com.swp391.dichvuchuyennha.entity.Contract;
import com.swp391.dichvuchuyennha.entity.Quotations;
import com.swp391.dichvuchuyennha.entity.Users;
import com.swp391.dichvuchuyennha.mapper.ContractMapper;
import com.swp391.dichvuchuyennha.repository.ContractRepository;
import com.swp391.dichvuchuyennha.repository.QuotationRepository;
import com.swp391.dichvuchuyennha.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
    private final ContractMapper contractMapper;
    private final QuotationRepository quotationRepository;
// inject mapper
public ContractResponse createContract(ContractRequest request) {
    Quotations quotation = quotationRepository.findById(request.getQuotationId())
            .orElseThrow(() -> new RuntimeException("Quotation not found"));

    Contract contract = new Contract();
    contract.setQuotation(quotation);
    contract.setStartDate(request.getStartDate());
    contract.setEndDate(request.getEndDate());
    contract.setDepositAmount(request.getDepositAmount());
    contract.setTotalAmount(quotation.getTotalPrice());
    contract.setStatus("UNSIGNED");

    Contract saved = contractRepository.save(contract);
    quotation.setStatus("CREATED");
    quotationRepository.save(quotation);

    return contractMapper.toResponse(saved);
}



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
    @Transactional(readOnly = true)
    public List<ContractResponse> getSignedContractsOfCurrentUser() {
        // Lấy thông tin user hiện tại từ Spring Security
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) {
            throw new RuntimeException("User not authenticated");
        }

        String username = auth.getName(); // giả sử username là unique
        Users user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Lấy hợp đồng đã ký của user
        List<Contract> contracts = contractRepository.findByQuotation_Survey_Request_User_UserIdAndStatus(
                user.getUserId(), "SIGNED"
        );

        return contracts.stream()
                .map(contractMapper::toResponse)
                .toList();
    }


    public ContractResponse updateContract(Integer id, ContractRequest request) {
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contract not found"));

        contract.setStartDate(request.getStartDate());
        contract.setEndDate(request.getEndDate());
        contract.setDepositAmount(request.getDepositAmount());
        contractRepository.save(contract);

        return contractMapper.toResponse(contract);
    }

    // Xóa hợp đồng
    public void deleteContract(Integer id) {
        if (!contractRepository.existsById(id)) throw new RuntimeException("Contract not found");
        contractRepository.deleteById(id);
    }

    // Lấy danh sách hợp đồng
    public List<ContractResponse> getAllContracts() {
        return contractRepository.findAll()
                .stream()
                .map(contractMapper::toResponse)
                .toList();
    }
}


