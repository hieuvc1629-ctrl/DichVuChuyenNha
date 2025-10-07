package com.swp391.dichvuchuyennha.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.util.Date;

@Data
public class RequestCreateRequest {
    @NotBlank
    private String description;
    private Integer businessId;
    private Integer userId;
    @NotBlank
    private String pickupAddress;
    @NotBlank
    private String destinationAddress;

    // Optional: planned moving day
    private Date movingDay;
}


