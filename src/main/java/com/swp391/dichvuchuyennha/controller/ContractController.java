package com.swp391.dichvuchuyennha.controller;

import com.swp391.dichvuchuyennha.dto.response.ContractDTO;
import com.swp391.dichvuchuyennha.dto.response.ContractResponse;
import com.swp391.dichvuchuyennha.entity.Contract;
import com.swp391.dichvuchuyennha.entity.Users;
import com.swp391.dichvuchuyennha.repository.ContractRepository;
import com.swp391.dichvuchuyennha.service.AuthenticationService;
import com.swp391.dichvuchuyennha.service.ContractService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contracts")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ContractController {

    private final ContractRepository contractRepository;
    private final ContractService contractService;
    private final AuthenticationService authService;

    /** Lấy danh sách hợp đồng chưa ký của user đang login */
    @GetMapping("/unsigned/me")
    public ResponseEntity<List<ContractResponse>> getUnsignedContracts(
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.substring(7);
        Users user = authService.verifyAndParseToken(token);

        List<ContractResponse> contracts = contractService.getUnsignedContracts(user.getUserId());
        return ResponseEntity.ok(contracts);
    }

    /** Ký hợp đồng */
    @PutMapping("/sign/{contractId}")
    public ResponseEntity<ContractResponse> signContract(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Integer contractId) {

        String token = authHeader.substring(7);
        Users user = authService.verifyAndParseToken(token);

        ContractResponse signed = contractService.signContract(contractId, user.getUserId());
        return ResponseEntity.ok(signed);
    }
    // GET tất cả hợp đồng (dùng DTO)
    @GetMapping
    public List<ContractDTO> getAllContracts() {
        return contractRepository.findAll().stream()
                .map(c -> new ContractDTO(c.getContractId(), c.getStatus()))
                .toList();
    }
}
