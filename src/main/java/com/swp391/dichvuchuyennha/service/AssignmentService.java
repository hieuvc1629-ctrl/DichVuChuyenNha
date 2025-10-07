package com.swp391.dichvuchuyennha.service;

import com.swp391.dichvuchuyennha.dto.request.AssignEmployeeRequest;
import com.swp391.dichvuchuyennha.entity.AssignmentEmployee;
import com.swp391.dichvuchuyennha.entity.Contract;
import com.swp391.dichvuchuyennha.entity.Employee;
import com.swp391.dichvuchuyennha.repository.AssignmentEmployeeRepository;
import com.swp391.dichvuchuyennha.repository.ContractRepository;
import com.swp391.dichvuchuyennha.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AssignmentService {

    private final AssignmentEmployeeRepository assignmentRepo;
    private final ContractRepository contractRepo;
    private final EmployeeRepository employeeRepo;

    public AssignmentEmployee assignEmployeeToContract(AssignEmployeeRequest request) {
        Contract contract = contractRepo.findById(request.getContractId())
                .orElseThrow(() -> new RuntimeException("Contract not found"));

        Employee employee = employeeRepo.findById(request.getEmployeeId())
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        AssignmentEmployee assignment = new AssignmentEmployee();
        assignment.setContract(contract);
        assignment.setEmployee(employee);
        assignment.setAssignedTime(request.getAssignedTime());

        return assignmentRepo.save(assignment);
    }
}
