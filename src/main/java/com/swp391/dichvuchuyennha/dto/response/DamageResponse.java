package com.swp391.dichvuchuyennha.dto.response;

import lombok.Data;

@Data
public class DamageResponse {
    private Integer damageId;
    private Integer contractId;
    private String cause;
    private Integer responsibleEmployeeId;
    private Double cost;
    private String status;
}
