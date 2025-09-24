package com.swp391.dichvuchuyennha.mapper;

import com.swp391.dichvuchuyennha.dto.response.WorkProgressResponse;
import com.swp391.dichvuchuyennha.entity.WorkProgress;
import org.springframework.stereotype.Component;

@Component
public class WorkProgressMapper {

    public WorkProgressResponse toResponse(WorkProgress wp) {
        if (wp == null) return null;
        WorkProgressResponse res = new WorkProgressResponse();
        res.setProgressId(wp.getProgressId());
        if (wp.getContract() != null) res.setContractId(wp.getContract().getContractId());
        if (wp.getEmployee() != null) res.setEmployeeId(wp.getEmployee().getEmployeeId());
        res.setTaskDescription(wp.getTaskDescription());
        res.setProgressStatus(wp.getProgressStatus());
        res.setUpdatedAt(wp.getUpdatedAt());
        return res;
    }
}
