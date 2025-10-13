package com.swp391.dichvuchuyennha.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeDTO {
    private Integer employeeId;
    private Integer userId;
    private String username;
    private String email;
    private String phone;
    private String position;
    private String status;
}
