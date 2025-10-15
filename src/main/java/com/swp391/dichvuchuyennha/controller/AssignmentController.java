package com.swp391.dichvuchuyennha.controller;

import com.swp391.dichvuchuyennha.service.AssignmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/assignments")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AssignmentController {

    private final AssignmentService assignmentService;

    @PostMapping("/assign")
    public ResponseEntity<String> assignEmployee(
            @RequestParam Integer contractId,
            @RequestParam Integer employeeId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate assignedDate
    ) {
        assignmentService.assignEmployeeToContract(contractId, employeeId, assignedDate);
        return ResponseEntity.ok("Gán nhân viên thành công");
    }
}
