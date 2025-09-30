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
@CrossOrigin(origins = "http://localhost:5173")
public class ContractController {

    private final ContractService contractService;

    // GET danh sách hợp đồng chưa ký
    @GetMapping("/unsigned/{userId}")
    public ResponseEntity<List<ContractResponse>> getUnsignedContracts(@PathVariable Integer userId) {
        return ResponseEntity.ok(contractService.getUnsignedContracts(userId));
    }

    // PUT ký hợp đồng
    @PutMapping("/sign/{userId}/{contractId}")
    public ResponseEntity<ContractResponse> signContract(
            @PathVariable Integer userId,
            @PathVariable Integer contractId) {
        return ResponseEntity.ok(contractService.signContract(contractId, userId));
    }
}
