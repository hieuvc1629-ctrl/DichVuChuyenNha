package com.swp391.dichvuchuyennha.controller;


import com.swp391.dichvuchuyennha.dto.request.ApiResponse;
import com.swp391.dichvuchuyennha.dto.request.EmployeeCreateRequest;
import com.swp391.dichvuchuyennha.dto.request.UserCreateRequest;
import com.swp391.dichvuchuyennha.dto.response.RoleResponse;
import com.swp391.dichvuchuyennha.dto.response.UserResponse;
import com.swp391.dichvuchuyennha.entity.Roles;
import com.swp391.dichvuchuyennha.repository.RoleRepository;
import com.swp391.dichvuchuyennha.service.AdminService;
import com.swp391.dichvuchuyennha.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")

public class AdminController {

    @Autowired
    AdminService adminService;
    @Autowired
    RoleRepository roleRepository;

    @PostMapping("/create-admin")
    public ResponseEntity<ApiResponse<UserResponse>> createUser(@RequestBody UserCreateRequest request){
        UserResponse user = adminService.createUser(request);
        return ResponseEntity.ok(
                ApiResponse.<UserResponse>builder()
                        .code(1000)
                        .message("User created successfully")
                        .result(user)
                        .build()
        );
    }

    @GetMapping("/all-roles")
    public ResponseEntity<ApiResponse<List<RoleResponse>>> getAllRoles() {
        List<RoleResponse> roles = roleRepository.findAll()
                .stream()
                .map(r -> new RoleResponse(r.getRoleId(), r.getRoleName()))
                .toList();

        return ResponseEntity.ok(
                ApiResponse.<List<RoleResponse>>builder()
                        .code(1000)
                        .message("All roles list")
                        .result(roles)
                        .build()
        );
    }
    @PostMapping("/create-employee")
    public ResponseEntity<ApiResponse<UserResponse>> createEmployee(@RequestBody EmployeeCreateRequest request) {
        var result = adminService.createEmployeeUser(request);
        return ResponseEntity.ok(
                ApiResponse.<UserResponse>builder()
                        .message("Tạo employee user thành công")
                        .result(result)
                        .build()
        );
    }


}


