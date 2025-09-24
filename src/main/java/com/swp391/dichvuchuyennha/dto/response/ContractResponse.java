package com.swp391.dichvuchuyennha.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContractResponse {

    private Integer contractId;
    private LocalDate startDate;
    private LocalDate endDate;
    private Double depositAmount;
    private Double totalAmount;
    private String status;
    private LocalDateTime signedDate;

    // Thông tin user owner
    private Integer ownerId;
    private String ownerUsername;

    // Thông tin người đã ký
    private Integer signedById;
    private String signedByUsername;
}
