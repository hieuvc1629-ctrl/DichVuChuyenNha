package com.swp391.dichvuchuyennha.controller;

import com.nimbusds.jose.JWSVerifier;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.SignedJWT;
import com.swp391.dichvuchuyennha.dto.request.DamageRequest;
import com.swp391.dichvuchuyennha.dto.response.DamageResponse;
import com.swp391.dichvuchuyennha.entity.Employee;
import com.swp391.dichvuchuyennha.exception.AppException;
import com.swp391.dichvuchuyennha.exception.ErrorCode;
import com.swp391.dichvuchuyennha.repository.EmployeeRepository;
import com.swp391.dichvuchuyennha.service.DamagesService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/damages")
@RequiredArgsConstructor
public class DamagesController {

    private final DamagesService damagesService;
    private final EmployeeRepository employeeRepository;

    @Value("${jwt.secret}")
    private String jwtSecret;

    private Long extractUserIdFromToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
        String token = authHeader.substring(7);

        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            JWSVerifier verifier = new MACVerifier(jwtSecret.getBytes());

            boolean valid = signedJWT.verify(verifier);
            if (!valid) throw new AppException(ErrorCode.UNAUTHENTICATED);

            Date expiry = signedJWT.getJWTClaimsSet().getExpirationTime();
            if (expiry.before(new Date())) throw new AppException(ErrorCode.UNAUTHENTICATED);

            return signedJWT.getJWTClaimsSet().getLongClaim("userId");

        } catch (ParseException | com.nimbusds.jose.JOSEException e) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
    }

    @GetMapping
    public ResponseEntity<List<DamageResponse>> getMyDamages(@RequestHeader("Authorization") String authHeader) {
        Long userId = extractUserIdFromToken(authHeader);
        Employee employee = employeeRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        return ResponseEntity.ok(damagesService.getByEmployeeId(employee.getEmployeeId()));
    }

    @PostMapping
    public ResponseEntity<DamageResponse> createDamage(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody DamageRequest request) {

        Long userId = extractUserIdFromToken(authHeader);
        Employee employee = employeeRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        return ResponseEntity.ok(damagesService.createDamage(employee.getEmployeeId(), request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DamageResponse> updateDamage(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Integer id,
            @RequestBody DamageRequest request) {

        Long userId = extractUserIdFromToken(authHeader);
        Employee employee = employeeRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        return ResponseEntity.ok(damagesService.updateDamage(id, employee.getEmployeeId(), request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDamage(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Integer id) {

        Long userId = extractUserIdFromToken(authHeader);
        Employee employee = employeeRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        damagesService.deleteDamage(id, employee.getEmployeeId());
        return ResponseEntity.noContent().build();
    }
}
