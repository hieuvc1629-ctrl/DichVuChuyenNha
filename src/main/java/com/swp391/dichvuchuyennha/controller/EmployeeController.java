package com.swp391.dichvuchuyennha.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.swp391.dichvuchuyennha.dto.request.ApiResponse;
import com.swp391.dichvuchuyennha.dto.request.EmployeeUpdateRequest;
import com.swp391.dichvuchuyennha.dto.response.EmployeeDTO;
import com.swp391.dichvuchuyennha.dto.response.EmployeeDetailResponse;
import com.swp391.dichvuchuyennha.service.EmployeeService;
import com.swp391.dichvuchuyennha.repository.EmployeeRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class EmployeeController {

    private final EmployeeService employeeService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<EmployeeDTO>>> getAllEmployees() {
        List<EmployeeDTO> employees = employeeService.getAllEmployees();
        return ResponseEntity.ok(
                ApiResponse.<List<EmployeeDTO>>builder()
                        .code(1000)
                        .message("Employees retrieved successfully")
                        .result(employees)
                        .build()
        );
    }

    @GetMapping("/{employeeId}")
    public ResponseEntity<ApiResponse<EmployeeDTO>> getEmployeeById(@PathVariable Integer employeeId) {
        EmployeeDTO employee = employeeService.getEmployeeById(employeeId);
        return ResponseEntity.ok(
                ApiResponse.<EmployeeDTO>builder()
                        .code(1000)
                        .message("Employee retrieved successfully")
                        .result(employee)
                        .build()
        );
    }

    @GetMapping("/{employeeId}/detail")
    public ResponseEntity<ApiResponse<EmployeeDetailResponse>> getEmployeeDetail(@PathVariable Integer employeeId) {
        EmployeeDetailResponse employeeDetail = employeeService.getEmployeeDetail(employeeId);
        return ResponseEntity.ok(
                ApiResponse.<EmployeeDetailResponse>builder()
                        .code(1000)
                        .message("Employee detail retrieved successfully")
                        .result(employeeDetail)
                        .build()
        );
    }

    @PutMapping("/{employeeId}")
    public ResponseEntity<ApiResponse<EmployeeDTO>> updateEmployee(
            @PathVariable Integer employeeId,
            @RequestBody EmployeeUpdateRequest request) {
        EmployeeDTO updatedEmployee = employeeService.updateEmployee(employeeId, request);
        return ResponseEntity.ok(
                ApiResponse.<EmployeeDTO>builder()
                        .code(1000)
                        .message("Employee updated successfully")
                        .result(updatedEmployee)
                        .build()
        );
    }

    @DeleteMapping("/{employeeId}")
    public ResponseEntity<ApiResponse<Void>> deleteEmployee(@PathVariable Integer employeeId) {
        employeeService.deleteEmployee(employeeId);
        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .code(1000)
                        .message("Employee deleted successfully")
                        .build()
        );
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<EmployeeDTO>>> getEmployeesByStatus(@PathVariable String status) {
        List<EmployeeDTO> employees = employeeService.getEmployeesByStatus(status);
        return ResponseEntity.ok(
                ApiResponse.<List<EmployeeDTO>>builder()
                        .code(1000)
                        .message("Employees retrieved successfully")
                        .result(employees)
                        .build()
        );
    }

    @GetMapping("/position/{position}")
    public ResponseEntity<ApiResponse<List<EmployeeDTO>>> getEmployeesByPosition(@PathVariable String position) {
        List<EmployeeDTO> employees = employeeService.getEmployeesByPosition(position);
        return ResponseEntity.ok(
                ApiResponse.<List<EmployeeDTO>>builder()
                        .code(1000)
                        .message("Employees retrieved successfully")
                        .result(employees)
                        .build()
        );
    }
}
