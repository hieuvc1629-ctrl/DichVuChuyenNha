package com.swp391.dichvuchuyennha.controller;

import com.swp391.dichvuchuyennha.dto.request.LoginRequest;
import com.swp391.dichvuchuyennha.dto.request.RegisterRequest;
import com.swp391.dichvuchuyennha.dto.response.ApiResponse;
import com.swp391.dichvuchuyennha.dto.response.LoginResponse;
import com.swp391.dichvuchuyennha.dto.response.UserResponse;
import com.swp391.dichvuchuyennha.entity.Users;
import com.swp391.dichvuchuyennha.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@RequestBody LoginRequest loginRequest) {
        try {
            LoginResponse loginResponse = authService.authenticate(loginRequest);
            return ResponseEntity.ok(ApiResponse.success("Login successful", loginResponse));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error(e.getMessage(), HttpStatus.UNAUTHORIZED.value()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR.value()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> register(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            Users newUser = authService.register(registerRequest);
            
            // Convert Users entity to UserResponse DTO
            UserResponse userResponse = UserResponse.builder()
                    .userId(newUser.getUserId())
                    .username(newUser.getUsername())
                    .email(newUser.getEmail())
                    .phone(newUser.getPhone())
                    .roleId(newUser.getRole() != null ? newUser.getRole().getRoleId() : null)
                    .roleName(newUser.getRole() != null ? newUser.getRole().getRoleName() : null)
                    .build();
            
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("User registered successfully", userResponse));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage(), HttpStatus.BAD_REQUEST.value()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR.value()));
        }
    }
}
