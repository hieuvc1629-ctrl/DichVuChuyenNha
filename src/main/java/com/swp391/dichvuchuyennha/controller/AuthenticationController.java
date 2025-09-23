package com.swp391.dichvuchuyennha.controller;

import com.swp391.dichvuchuyennha.dto.request.AuthenticationRequest;
import com.swp391.dichvuchuyennha.dto.response.AuthenticationResponse;
import com.swp391.dichvuchuyennha.dto.request.ApiResponse;
import com.swp391.dichvuchuyennha.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173") // chỉ cho phép React gọi

public class AuthenticationController {

    private final AuthenticationService authenticationService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthenticationResponse>> login(
            @RequestBody AuthenticationRequest request
    ) {
        var result = authenticationService.authenticate(request);
        return ResponseEntity.ok(
                ApiResponse.<AuthenticationResponse>builder()
                        .message("Login successful")
                        .result(result)
                        .build()
        );
    }
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            authenticationService.logout(token);
        }
        return ResponseEntity.ok().body("Logged out successfully");
    }
}
