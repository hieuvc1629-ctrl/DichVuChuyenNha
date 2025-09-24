package com.swp391.dichvuchuyennha.controller;

import com.swp391.dichvuchuyennha.dto.response.ContractResponse;
import com.swp391.dichvuchuyennha.service.ContractService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contracts")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173") //
public class ContractController {

    private final ContractService contractService;

    // Lấy danh sách hợp đồng chưa ký của user
    @GetMapping("/unsigned/{userId}")
    public ResponseEntity<List<ContractResponse>> getUnsignedContracts(@PathVariable Integer userId) {
        List<ContractResponse> contracts = contractService.getUnsignedContracts(userId);
        return ResponseEntity.ok(contracts);
    }

    // PUT khi user nhấn "Tôi đồng ý" để ký hợp đồng
    @PutMapping("/sign/{userId}/{contractId}")
    public ResponseEntity<ContractResponse> signContract(
            @PathVariable Integer userId,
            @PathVariable Integer contractId) {
        ContractResponse signedContract = contractService.signContract(contractId, userId);
        return ResponseEntity.ok(signedContract);
    }
}
