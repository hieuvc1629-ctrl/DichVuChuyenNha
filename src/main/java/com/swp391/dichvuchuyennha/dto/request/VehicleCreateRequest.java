package com.swp391.dichvuchuyennha.dto.request;

import lombok.Data;

@Data
public class VehicleCreateRequest {
    private String vehicleType;
    private String licensePlate;
    private Double capacity;
    private String status;
    private Integer quotationId;
    private Integer driverId;
}
