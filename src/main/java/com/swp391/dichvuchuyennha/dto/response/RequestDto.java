package com.swp391.dichvuchuyennha.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RequestDto {
    private Integer requestId;
    private String username;
    private String companyName;
}

