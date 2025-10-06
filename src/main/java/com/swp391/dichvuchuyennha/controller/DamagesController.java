package com.swp391.dichvuchuyennha.controller;

import com.swp391.dichvuchuyennha.dto.request.DamageRequest;
import com.swp391.dichvuchuyennha.dto.response.DamageResponse;
import com.swp391.dichvuchuyennha.service.DamagesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/damages")
@RequiredArgsConstructor
public class DamagesController {

    private final DamagesService damagesService;

    @PostMapping
    @PreAuthorize("hasAnyRole('employee', 'manager')") // Employee/manager tạo damage
    public ResponseEntity<DamageResponse> createDamage(@RequestBody DamageRequest request) {
        return ResponseEntity.ok(damagesService.createDamage(request));
    }

    @PutMapping("/{damageId}")
    @PreAuthorize("hasAnyRole('employee', 'manager')") // Employee/manager update
    public ResponseEntity<DamageResponse> updateDamage(
            @PathVariable Integer damageId,
            @RequestBody DamageRequest request) {
        return ResponseEntity.ok(damagesService.updateDamage(damageId, request));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('manager', 'admin')") // Manager/admin xem all
    public ResponseEntity<List<DamageResponse>> getAllDamages() {
        return ResponseEntity.ok(damagesService.getAllDamages());
    }

    @GetMapping("/{damageId}")
    @PreAuthorize("hasAnyRole('employee', 'manager', 'admin')") // Employee/manager/admin xem chi tiết
    public ResponseEntity<DamageResponse> getDamageById(@PathVariable Integer damageId) {
        return ResponseEntity.ok(damagesService.getDamageById(damageId));
    }

    @DeleteMapping("/{damageId}")
    @PreAuthorize("hasRole('manager')") // Chỉ manager xóa
    public ResponseEntity<Void> deleteDamage(@PathVariable Integer damageId) {
        damagesService.deleteDamage(damageId);
        return ResponseEntity.noContent().build();
    }
}
