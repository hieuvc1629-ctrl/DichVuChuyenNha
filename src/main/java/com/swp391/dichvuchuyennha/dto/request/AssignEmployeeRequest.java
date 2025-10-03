package com.swp391.dichvuchuyennha.dto.request;

import lombok.Data;

import java.time.LocalDate;

@Data
public class AssignEmployeeRequest {
    private Integer contractId;
    private Integer employeeId;
    private LocalDate assignedTime;
}
