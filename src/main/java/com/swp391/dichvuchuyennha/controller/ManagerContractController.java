package com.swp391.dichvuchuyennha.controller;

import com.swp391.dichvuchuyennha.dto.request.ApiResponse;
import com.swp391.dichvuchuyennha.dto.request.CreateContractRequest;
import com.swp391.dichvuchuyennha.dto.response.ManagerContractInfoDTO;
import com.swp391.dichvuchuyennha.entity.Contract;
import com.swp391.dichvuchuyennha.service.ManagerContractService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/manager/contracts")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")

public class ManagerContractController {

    private final ManagerContractService managerContractService;

    /**
     * Lấy danh sách tất cả hợp đồng mà manager có thể quản lý
     * Chỉ lấy request trạng thái PENDING và survey trạng thái DONE
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<ManagerContractInfoDTO>>> getContracts() {
        List<ManagerContractInfoDTO> contracts = managerContractService.getContractsForManager();

        ApiResponse<List<ManagerContractInfoDTO>> response = ApiResponse.<List<ManagerContractInfoDTO>>builder()
                .code(1000)
                .message("Success")
                .result(contracts)
                .build();

        return ResponseEntity.ok(response);
    }

    /**
     * Lấy chi tiết 1 hợp đồng theo quotationId
     */
    @GetMapping("/{quotationId}")
    public ResponseEntity<ApiResponse<ManagerContractInfoDTO>> getContractByQuotation(@PathVariable Integer quotationId) {
        ManagerContractInfoDTO contract = managerContractService.getContractsForManager().stream()
                .filter(c -> c.getQuotationId().equals(quotationId))
                .findFirst()
                .orElse(null);

        ApiResponse<ManagerContractInfoDTO> response = ApiResponse.<ManagerContractInfoDTO>builder()
                .code(contract != null ? 1000 : 2001)
                .message(contract != null ? "Success" : "Contract not found")
                .result(contract)
                .build();

        return ResponseEntity.ok(response);
    }
    @PostMapping("/create")
    public ResponseEntity<ApiResponse<Contract>> createContract(@RequestBody CreateContractRequest request) {
        Contract contract = managerContractService.createContract(request);
        return ResponseEntity.ok(ApiResponse.<Contract>builder()
                .code(1000)
                .message("Contract created successfully")
                .result(contract)
                .build()
        );
    }
}
