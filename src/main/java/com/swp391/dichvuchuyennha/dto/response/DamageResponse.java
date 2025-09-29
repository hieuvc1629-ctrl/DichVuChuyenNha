package com.swp391.dichvuchuyennha.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class DamageResponse {
    private Integer damageId;
    private Integer contractId;
    private Integer employeeId;
    private String cause;
    private Double cost;
    private String status;

    // Extended info giống WorkProgress
    private String customerName;
    private String serviceName;
    private LocalDate startDate;
    private LocalDate endDate;
    private Double totalAmount;
    private String employeeName;
}
