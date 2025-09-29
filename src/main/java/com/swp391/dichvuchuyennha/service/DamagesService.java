package com.swp391.dichvuchuyennha.service;

import com.swp391.dichvuchuyennha.dto.request.DamageRequest;
import com.swp391.dichvuchuyennha.dto.response.DamageResponse;

import java.util.List;

public interface DamagesService {
    List<DamageResponse> getByEmployeeId(Integer employeeId);
    DamageResponse createDamage(Integer employeeId, DamageRequest request);
    DamageResponse updateDamage(Integer damageId, Integer employeeId, DamageRequest request);
    void deleteDamage(Integer damageId, Integer employeeId);
}
