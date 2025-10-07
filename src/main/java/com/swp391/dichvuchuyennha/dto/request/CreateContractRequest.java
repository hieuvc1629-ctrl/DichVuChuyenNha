package com.swp391.dichvuchuyennha.dto.request;

import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateContractRequest {
    private Integer quotationId;
    private LocalDate startDate;
    private LocalDate endDate;
    private Double depositAmount;
    private Double totalAmount;
}
