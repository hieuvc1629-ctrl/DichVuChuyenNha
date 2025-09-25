package com.swp391.dichvuchuyennha.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RequestCreateRequest {
    @NotBlank
    private String description;
    private Integer businessId;
}


