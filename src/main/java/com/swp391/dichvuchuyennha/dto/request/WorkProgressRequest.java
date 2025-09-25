package com.swp391.dichvuchuyennha.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkProgressRequest {
    // Khi tạo: contractId và employeeId bắt buộc, taskDescription optional
    private Integer contractId;
    private Integer employeeId;
    private String taskDescription;
    // Khi update có thể gửi progressStatus (pending, in_progress, completed)
    private String progressStatus;
}
