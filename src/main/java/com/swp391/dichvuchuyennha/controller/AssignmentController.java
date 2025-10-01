package com.swp391.dichvuchuyennha.controller;

import com.swp391.dichvuchuyennha.dto.request.AssignEmployeeRequest;
import com.swp391.dichvuchuyennha.entity.AssignmentEmployee;
import com.swp391.dichvuchuyennha.service.AssignmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/assignments")
@RequiredArgsConstructor
public class AssignmentController {

    private final AssignmentService assignmentService;

    @PostMapping
    public ResponseEntity<AssignmentEmployee> assignEmployee(@RequestBody AssignEmployeeRequest request) {
        AssignmentEmployee result = assignmentService.assignEmployeeToContract(request);
        return ResponseEntity.ok(result);
    }
}
