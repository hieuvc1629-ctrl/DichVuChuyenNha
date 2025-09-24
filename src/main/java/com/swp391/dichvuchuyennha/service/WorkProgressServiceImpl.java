package com.swp391.dichvuchuyennha.service;

import com.swp391.dichvuchuyennha.entity.Contract;
import com.swp391.dichvuchuyennha.entity.Employee;
import com.swp391.dichvuchuyennha.entity.WorkProgress;
import com.swp391.dichvuchuyennha.exception.AppException;
import com.swp391.dichvuchuyennha.exception.ErrorCode;
import com.swp391.dichvuchuyennha.mapper.WorkProgressMapper;
import com.swp391.dichvuchuyennha.repository.ContractRepository;
import com.swp391.dichvuchuyennha.repository.EmployeeRepository;
import com.swp391.dichvuchuyennha.repository.WorkProgressRepository;
import com.swp391.dichvuchuyennha.dto.request.WorkProgressRequest;
import com.swp391.dichvuchuyennha.dto.response.WorkProgressResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkProgressServiceImpl implements WorkProgressService {

    private final WorkProgressRepository workProgressRepository;
    private final ContractRepository contractRepository;
    private final EmployeeRepository employeeRepository;
    private final WorkProgressMapper mapper;

    // ✅ Lấy toàn bộ tiến độ
    @Override
    public List<WorkProgressResponse> getAllWorkProgress() {
        return workProgressRepository.findAll()
                .stream()
                .map(mapper::toResponse)
                .collect(Collectors.toList());
    }

    // ✅ Lấy tiến độ theo ID
    @Override
    public WorkProgressResponse getWorkProgressById(Integer id) {
        WorkProgress workProgress = workProgressRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.WORK_PROGRESS_NOT_FOUND));
        return mapper.toResponse(workProgress);
    }

    // ✅ Tạo mới tiến độ
    @Override
    public WorkProgressResponse createWorkProgress(WorkProgressRequest request) {
        Contract contract = contractRepository.findById(request.getContractId())
                .orElseThrow(() -> new AppException(ErrorCode.CONTRACT_NOT_FOUND));

        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new AppException(ErrorCode.EMPLOYEE_NOT_FOUND));

        WorkProgress workProgress = new WorkProgress();
        workProgress.setContract(contract);
        workProgress.setEmployee(employee);
        workProgress.setTaskDescription(request.getTaskDescription());
        workProgress.setProgressStatus(request.getProgressStatus());
        workProgress.setUpdatedAt(LocalDateTime.now());

        WorkProgress saved = workProgressRepository.save(workProgress);
        return mapper.toResponse(saved);
    }

    // ✅ Cập nhật tiến độ
    @Override
    public WorkProgressResponse updateWorkProgress(Integer id, WorkProgressRequest request) {
        WorkProgress workProgress = workProgressRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.WORK_PROGRESS_NOT_FOUND));

        if (request.getContractId() != null) {
            Contract contract = contractRepository.findById(request.getContractId())
                    .orElseThrow(() -> new AppException(ErrorCode.CONTRACT_NOT_FOUND));
            workProgress.setContract(contract);
        }

        if (request.getEmployeeId() != null) {
            Employee employee = employeeRepository.findById(request.getEmployeeId())
                    .orElseThrow(() -> new AppException(ErrorCode.EMPLOYEE_NOT_FOUND));
            workProgress.setEmployee(employee);
        }

        if (request.getTaskDescription() != null) {
            workProgress.setTaskDescription(request.getTaskDescription());
        }

        if (request.getProgressStatus() != null) {
            workProgress.setProgressStatus(request.getProgressStatus());
        }

        workProgress.setUpdatedAt(LocalDateTime.now());

        WorkProgress updated = workProgressRepository.save(workProgress);
        return mapper.toResponse(updated);
    }

    // ✅ Xóa tiến độ
    @Override
    public void deleteWorkProgress(Integer id) {
        WorkProgress workProgress = workProgressRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.WORK_PROGRESS_NOT_FOUND));
        workProgressRepository.delete(workProgress);
    }
}
