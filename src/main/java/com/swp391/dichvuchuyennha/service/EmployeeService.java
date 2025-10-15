<<<<<<< HEAD
package com.swp391.dichvuchuyennha.service;

import com.swp391.dichvuchuyennha.dto.response.EmployeeDTO;
import com.swp391.dichvuchuyennha.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    @Transactional(readOnly = true)
    public List<EmployeeDTO> getAllEmployees() {
        return employeeRepository.findAll().stream()
                .map(emp -> new EmployeeDTO(
                        emp.getEmployeeId(),
                        emp.getUser() != null ? emp.getUser().getUsername() : "No user",
                        emp.getPosition()
                ))
                .toList();
    }
    public List<EmployeeDTO> getFreeEmployees() {
        return employeeRepository.findFreeEmployeeDTO();
    }
}// employee sau khi bỏ của dũng
=======
//package com.swp391.dichvuchuyennha.service;
//
//import com.swp391.dichvuchuyennha.dto.request.EmployeeUpdateRequest;
//import com.swp391.dichvuchuyennha.dto.response.EmployeeDTO;
//import com.swp391.dichvuchuyennha.dto.response.EmployeeDetailResponse;
//import com.swp391.dichvuchuyennha.entity.AssignmentEmployee;
//import com.swp391.dichvuchuyennha.entity.Employee;
//import com.swp391.dichvuchuyennha.exception.AppException;
//import com.swp391.dichvuchuyennha.exception.ErrorCode;
//import com.swp391.dichvuchuyennha.repository.AssignmentEmployeeRepository;
//import com.swp391.dichvuchuyennha.repository.EmployeeRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.time.format.DateTimeFormatter;
//import java.util.List;
//import java.util.stream.Collectors;
//
//@Service
//@RequiredArgsConstructor
//public class EmployeeService {
//
//    private final EmployeeRepository employeeRepository;
//    private final AssignmentEmployeeRepository assignmentEmployeeRepository;
//
//    @Transactional(readOnly = true)
//    public List<EmployeeDTO> getAllEmployees() {
//        return employeeRepository.findAllEmployeeDTO();
//    }
//
//    @Transactional(readOnly = true)
//    public EmployeeDTO getEmployeeById(Integer employeeId) {
//        Employee employee = employeeRepository.findById(employeeId)
//                .orElseThrow(() -> new AppException(ErrorCode.EMPLOYEE_NOT_EXISTED));
//        return convertToEmployeeDTO(employee);
//    }
//
//    @Transactional(readOnly = true)
//    public EmployeeDetailResponse getEmployeeDetail(Integer employeeId) {
//        Employee employee = employeeRepository.findByIdWithUser(employeeId)
//                .orElseThrow(() -> new AppException(ErrorCode.EMPLOYEE_NOT_EXISTED));
//
//        return convertToEmployeeDetailResponse(employee);
//    }
//
//    @Transactional
//    public EmployeeDTO updateEmployee(Integer employeeId, EmployeeUpdateRequest request) {
//        Employee employee = employeeRepository.findById(employeeId)
//                .orElseThrow(() -> new AppException(ErrorCode.EMPLOYEE_NOT_EXISTED));
//
//        employee.setPosition(request.getPosition());
//        employee.setPhone(request.getPhone());
//        employee.setStatus(request.getStatus());
//
//        Employee updatedEmployee = employeeRepository.save(employee);
//        return convertToEmployeeDTO(updatedEmployee);
//    }
//
//    @Transactional
//    public void deleteEmployee(Integer employeeId) {
//        Employee employee = employeeRepository.findById(employeeId)
//                .orElseThrow(() -> new AppException(ErrorCode.EMPLOYEE_NOT_EXISTED));
//
//        // Check if employee has assignments
//        List<AssignmentEmployee> assignments = assignmentEmployeeRepository.findByEmployeeEmployeeId(employeeId);
//        if (!assignments.isEmpty()) {
//            throw new AppException(ErrorCode.EMPLOYEE_HAS_ASSIGNMENTS);
//        }
//
//        employeeRepository.delete(employee);
//    }
//
//    @Transactional(readOnly = true)
//    public List<EmployeeDTO> getEmployeesByStatus(String status) {
//        return employeeRepository.findByStatus(status).stream()
//                .map(this::convertToEmployeeDTO)
//                .collect(Collectors.toList());
//    }
//
//    @Transactional(readOnly = true)
//    public List<EmployeeDTO> getEmployeesByPosition(String position) {
//        return employeeRepository.findByPosition(position).stream()
//                .map(this::convertToEmployeeDTO)
//                .collect(Collectors.toList());
//    }
//
//    private EmployeeDTO convertToEmployeeDTO(Employee employee) {
//        return new EmployeeDTO(
//                employee.getEmployeeId(),
//                employee.getUser() != null ? employee.getUser().getUserId() : null,
//                employee.getUser() != null ? employee.getUser().getUsername() : "No user",
//                employee.getUser() != null ? employee.getUser().getEmail() : null,
//                employee.getPhone(),
//                employee.getPosition(),
//                employee.getStatus()
//        );
//    }
//
//    private EmployeeDetailResponse convertToEmployeeDetailResponse(Employee employee) {
//        // Get contract history from assignments
//        List<EmployeeDetailResponse.EmployeeContractHistory> contractHistory =
//                assignmentEmployeeRepository.findByEmployeeEmployeeId(employee.getEmployeeId()).stream()
//                        .map(assignment -> new EmployeeDetailResponse.EmployeeContractHistory(
//                                assignment.getContract().getContractId(),
//                                assignment.getContract().getStatus(),
//                                assignment.getAssignedTime() != null ? assignment.getAssignedTime().format(DateTimeFormatter.ISO_LOCAL_DATE) : null,
//                                assignment.getContract().getStartDate() != null ? assignment.getContract().getStartDate().format(DateTimeFormatter.ISO_LOCAL_DATE) : null,
//                                assignment.getContract().getEndDate() != null ? assignment.getContract().getEndDate().format(DateTimeFormatter.ISO_LOCAL_DATE) : null,
//                                assignment.getContract().getTotalAmount()
//                        ))
//                        .collect(Collectors.toList());
//
//        return new EmployeeDetailResponse(
//                employee.getEmployeeId(),
//                employee.getUser() != null ? employee.getUser().getUserId() : null,
//                employee.getUser() != null ? employee.getUser().getUsername() : "No user",
//                employee.getUser() != null ? employee.getUser().getEmail() : null,
//                employee.getPhone(),
//                employee.getPosition(),
//                employee.getStatus(),
//                employee.getUser() != null && employee.getUser().getRole() != null ? employee.getUser().getRole().getRoleName() : null,
//                contractHistory
//        );
//    }
//}
>>>>>>> 50d3ace9be4f20731befc6c501569bf0a7dae5b1
