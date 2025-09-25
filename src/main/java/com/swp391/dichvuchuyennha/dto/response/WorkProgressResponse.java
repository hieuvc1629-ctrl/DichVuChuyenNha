package com.swp391.dichvuchuyennha.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkProgressResponse {
    private Integer progressId;
    private Integer contractId;
    private Integer employeeId;
    private String taskDescription;
    private String progressStatus;
    private LocalDateTime updatedAt;
}
