package com.swp391.dichvuchuyennha.mapper;

import com.swp391.dichvuchuyennha.dto.response.DamageResponse;
import com.swp391.dichvuchuyennha.entity.Damages;
import org.springframework.stereotype.Component;

@Component
public class DamageMapper {

    public DamageResponse toResponse(Damages damage) {
        DamageResponse response = new DamageResponse();
        response.setDamageId(damage.getDamageId());
        response.setContractId(
                damage.getContract() != null ? damage.getContract().getContractId() : null
        );
        response.setCause(damage.getCause());
        response.setResponsibleEmployeeId(
                damage.getResponsibleEmployee() != null ? damage.getResponsibleEmployee().getEmployeeId() : null
        );
        response.setCost(damage.getCost());
        response.setStatus(damage.getStatus());
        return response;
    }

}
