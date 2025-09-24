package com.swp391.dichvuchuyennha.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RequestResponse {
    private Integer requestId;
    private String status;
}


