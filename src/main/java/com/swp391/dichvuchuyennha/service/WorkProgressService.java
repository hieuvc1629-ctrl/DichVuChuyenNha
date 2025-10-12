package com.swp391.dichvuchuyennha.service;

import com.swp391.dichvuchuyennha.dto.request.WorkProgressRequest;
import com.swp391.dichvuchuyennha.dto.response.WorkProgressResponse;

import java.util.List;

public interface WorkProgressService {

    // ✅ Lấy toàn bộ tiến độ
    List<WorkProgressResponse> getAllWorkProgress();

    // ✅ Lấy tiến độ theo ID
    WorkProgressResponse getWorkProgressById(Integer id);

    // ✅ Tạo mới tiến độ
    WorkProgressResponse createWorkProgress(WorkProgressRequest request);

    // ✅ Cập nhật tiến độ
    WorkProgressResponse updateWorkProgress(Integer id, WorkProgressRequest request);

    // ✅ Xóa tiến độ
    void deleteWorkProgress(Integer id);
}
