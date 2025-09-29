package com.swp391.dichvuchuyennha.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ManagerContractInfoDTO {

    // Thông tin Request
    private Integer requestId;
    private String requestDescription;
    private LocalDateTime requestTime;
    private String requestStatus;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String customerCompanyName;

    // Thông tin Survey
    private Integer surveyId;
    private LocalDateTime surveyDate;
    private String addressFrom;
    private String addressTo;
    private String surveyStatus;

    // Thông tin Quotation
    private Integer quotationId;
    private Double totalPrice;
    private LocalDateTime quotationCreatedAt;
    private List<QuotationServiceDTO> quotationServices; // chi tiết dịch vụ
    private List<VehicleDTO> vehicles; // phương tiện đề xuất

    // Thông tin Contract (nếu đã tạo)
    private Integer contractId;
    private LocalDate startDate;
    private LocalDate endDate;
    private Double depositAmount;
    private Double totalAmount;
    private String contractStatus;
    private String signedBy;
    private LocalDateTime signedDate;
}
