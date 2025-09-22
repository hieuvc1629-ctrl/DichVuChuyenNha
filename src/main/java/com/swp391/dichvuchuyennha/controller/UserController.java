package com.swp391.dichvuchuyennha.controller;


import com.swp391.dichvuchuyennha.dto.request.ApiResponse;
import com.swp391.dichvuchuyennha.dto.request.UserCreateRequest;
import com.swp391.dichvuchuyennha.dto.response.UserResponse;
import com.swp391.dichvuchuyennha.entity.Roles;
import com.swp391.dichvuchuyennha.repository.RoleRepository;
import com.swp391.dichvuchuyennha.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173") 

public class UserController {

    @Autowired
    UserService userService;
    @Autowired
    RoleRepository roleRepository;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<UserResponse>> createUser(@RequestBody UserCreateRequest request){
        UserResponse user = userService.createUser(request);
        return ResponseEntity.ok(
                ApiResponse.<UserResponse>builder()
                        .code(1000)
                        .message("User created successfully")
                        .result(user)
                        .build()
        );
    }

    @GetMapping("/roles")
    public ResponseEntity<ApiResponse<List<Roles>>> getAllRoles() {

        return ResponseEntity.ok(
                ApiResponse.<List<Roles>>builder()
                        .code(1000)
                        .message("Role list")
                        .result(roleRepository.findAll())
                        .build()
        );
    }
}


