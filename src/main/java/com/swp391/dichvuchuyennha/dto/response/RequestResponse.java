package com.swp391.dichvuchuyennha.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class RequestResponse {
    private Integer requestId;
    private String status;
    private String description;
    private LocalDateTime requestTime;
    private String pickupAddress;
    private String destinationAddress;
}


