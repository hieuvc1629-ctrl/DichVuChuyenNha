package com.swp391.dichvuchuyennha.service;

import com.swp391.dichvuchuyennha.entity.AssignmentEmployee;
import com.swp391.dichvuchuyennha.entity.Contract;
import com.swp391.dichvuchuyennha.entity.Employee;
import com.swp391.dichvuchuyennha.repository.AssignmentEmployeeRepository;
import com.swp391.dichvuchuyennha.repository.ContractRepository;
import com.swp391.dichvuchuyennha.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class AssignmentService {

    private final AssignmentEmployeeRepository assignmentRepo;
    private final EmployeeRepository employeeRepo;
    private final ContractRepository contractRepo;

    @Transactional
    public void assignEmployeeToContract(Integer contractId, Integer employeeId, LocalDate assignedDate) {
        // Lấy thông tin hợp đồng và nhân viên
        Contract contract = contractRepo.findById(contractId)
                .orElseThrow(() -> new RuntimeException("Contract not found"));

        Employee employee = employeeRepo.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        // Kiểm tra trạng thái nhân viên
        if (!"free".equalsIgnoreCase(employee.getStatus())) {
            throw new RuntimeException("Employee is not free");
        }

        // Gán nhân viên vào hợp đồng
        AssignmentEmployee assignment = new AssignmentEmployee();
        assignment.setContract(contract);
        assignment.setEmployee(employee);
        assignment.setAssignedTime(assignedDate);

        assignmentRepo.save(assignment);

        // Cập nhật trạng thái nhân viên thành 'busy'
        employee.setStatus("busy");
        employeeRepo.save(employee);
    }
}
