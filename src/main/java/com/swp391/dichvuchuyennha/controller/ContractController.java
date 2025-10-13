package com.swp391.dichvuchuyennha.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.swp391.dichvuchuyennha.dto.response.ContractDTO;
import com.swp391.dichvuchuyennha.dto.response.ContractResponse;
import com.swp391.dichvuchuyennha.entity.Users;
import com.swp391.dichvuchuyennha.repository.ContractRepository;
import com.swp391.dichvuchuyennha.repository.UserRepository;
import com.swp391.dichvuchuyennha.service.AuthenticationService;
import com.swp391.dichvuchuyennha.service.ContractService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/contracts")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ContractController {

    private final ContractRepository contractRepository;
    private final ContractService contractService;
    private final AuthenticationService authService;
    private final UserRepository userRepository;

    /** Lấy danh sách hợp đồng chưa ký của user đang login */
    @GetMapping("/unsigned/me")
    public ResponseEntity<List<ContractResponse>> getUnsignedContracts() {
        // Lấy username từ context
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        // Lấy user từ DB
        Users user = userRepository.findByUsername(username).orElseThrow();

        // Lấy danh sách hợp đồng unsigned theo userId
        List<ContractResponse> contracts = contractService.getUnsignedContracts(user.getUserId());

        return ResponseEntity.ok(contracts);
    }

    /** Ký hợp đồng */
    @PutMapping("/sign/{contractId}")
    public ResponseEntity<ContractResponse> signContract(@PathVariable Integer contractId) {
        // Lấy username từ context
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        // Lấy user từ DB
        Users user = userRepository.findByUsername(username).orElseThrow();

        // Gọi service ký hợp đồng
        ContractResponse signed = contractService.signContract(contractId, user.getUserId());

        return ResponseEntity.ok(signed);
    }

    // GET tất cả hợp đồng (dùng DTO)
    @GetMapping
    public List<ContractDTO> getUnsignedContractsForManager() {
        return contractRepository.findByStatus("SIGNED").stream()
                .map(c -> new ContractDTO(c.getContractId(), c.getStatus()))
                .toList();
    }
}
