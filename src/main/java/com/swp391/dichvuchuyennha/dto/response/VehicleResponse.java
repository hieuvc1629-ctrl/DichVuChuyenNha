package com.swp391.dichvuchuyennha.dto.response;

import lombok.Data;

@Data
public class VehicleResponse {
    private Integer vehicleId;
    private String vehicleType;
    private String licensePlate;
    private Double capacity;
    private String status;
    private Integer quotationId;
    private Integer driverId;
}
