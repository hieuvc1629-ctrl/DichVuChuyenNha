package com.swp391.dichvuchuyennha.service;

import com.swp391.dichvuchuyennha.dto.request.DamageRequest;
import com.swp391.dichvuchuyennha.dto.response.DamageResponse;
import com.swp391.dichvuchuyennha.entity.Contract;
import com.swp391.dichvuchuyennha.entity.Damages;
import com.swp391.dichvuchuyennha.entity.Employee;
import com.swp391.dichvuchuyennha.exception.AppException;
import com.swp391.dichvuchuyennha.exception.ErrorCode;
import com.swp391.dichvuchuyennha.mapper.DamageMapper;
import com.swp391.dichvuchuyennha.repository.ContractRepository;
import com.swp391.dichvuchuyennha.repository.DamagesRepository;
import com.swp391.dichvuchuyennha.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DamagesServiceImpl implements DamagesService {

    private final DamagesRepository damagesRepository;
    private final EmployeeRepository employeeRepository;
    private final ContractRepository contractRepository;
    private final DamageMapper mapper;

    @Override
    public List<DamageResponse> getByEmployeeId(Integer employeeId) {
        return damagesRepository.findByResponsibleEmployee_EmployeeId(employeeId)
                .stream()
                .map(mapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public DamageResponse createDamage(Integer employeeId, DamageRequest request) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Contract contract = contractRepository.findById(request.getContractId())
                .orElseThrow(() -> new AppException(ErrorCode.CONTRACT_NOT_FOUND));

        Damages damage = new Damages();
        damage.setResponsibleEmployee(employee);
        damage.setContract(contract);
        damage.setCause(request.getCause());
        damage.setCost(request.getCost());
        damage.setStatus(request.getStatus() != null ? request.getStatus() : "pending");

        return mapper.toResponse(damagesRepository.save(damage));
    }

    @Override
    public DamageResponse updateDamage(Integer damageId, Integer employeeId, DamageRequest request) {
        Damages damage = damagesRepository.findById(damageId)
                .orElseThrow(() -> new AppException(ErrorCode.DAMAGE_NOT_FOUND));

        if (damage.getResponsibleEmployee() == null || !damage.getResponsibleEmployee().getEmployeeId().equals(employeeId)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        if (request.getCause() != null) damage.setCause(request.getCause());
        if (request.getCost() != null) damage.setCost(request.getCost());
        if (request.getStatus() != null) damage.setStatus(request.getStatus());

        return mapper.toResponse(damagesRepository.save(damage));
    }

    @Override
    public void deleteDamage(Integer damageId, Integer employeeId) {
        Damages damage = damagesRepository.findById(damageId)
                .orElseThrow(() -> new AppException(ErrorCode.DAMAGE_NOT_FOUND));

        if (damage.getResponsibleEmployee() == null || !damage.getResponsibleEmployee().getEmployeeId().equals(employeeId)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        damagesRepository.delete(damage);
    }
}
