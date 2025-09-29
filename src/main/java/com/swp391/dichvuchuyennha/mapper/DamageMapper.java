package com.swp391.dichvuchuyennha.mapper;

import com.swp391.dichvuchuyennha.dto.response.DamageResponse;
import com.swp391.dichvuchuyennha.entity.Damages;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface DamageMapper {

    DamageMapper INSTANCE = Mappers.getMapper(DamageMapper.class);

    @Mapping(source = "damageId", target = "damageId")
    @Mapping(source = "contract.contractId", target = "contractId")
    @Mapping(source = "responsibleEmployee.employeeId", target = "employeeId")
    @Mapping(source = "cause", target = "cause")
    @Mapping(source = "cost", target = "cost")
    @Mapping(source = "status", target = "status")

    // Extended fields như WorkProgress
    @Mapping(
            target = "customerName",
            expression = "java(entity.getContract() != null && " +
                    "entity.getContract().getQuotation() != null && " +
                    "entity.getContract().getQuotation().getSurvey() != null && " +
                    "entity.getContract().getQuotation().getSurvey().getRequest() != null && " +
                    "entity.getContract().getQuotation().getSurvey().getRequest().getBusiness() != null " +
                    "? entity.getContract().getQuotation().getSurvey().getRequest().getBusiness().getCompanyName() " +
                    ": (entity.getContract().getQuotation().getSurvey().getRequest().getUser() != null " +
                    "? entity.getContract().getQuotation().getSurvey().getRequest().getUser().getUsername() : null))"
    )
    @Mapping(
            target = "serviceName",
            expression = "java(entity.getContract() != null && " +
                    "entity.getContract().getQuotation() != null && " +
                    "entity.getContract().getQuotation().getSurvey() != null && " +
                    "entity.getContract().getQuotation().getSurvey().getRequest() != null " +
                    "? entity.getContract().getQuotation().getSurvey().getRequest().getDescription() : null)"
    )
    @Mapping(source = "contract.startDate", target = "startDate")
    @Mapping(source = "contract.endDate", target = "endDate")
    @Mapping(source = "contract.totalAmount", target = "totalAmount")
    @Mapping(
            target = "employeeName",
            expression = "java(entity.getResponsibleEmployee() != null && entity.getResponsibleEmployee().getUser() != null " +
                    "? entity.getResponsibleEmployee().getUser().getUsername() : null)"
    )
    DamageResponse toResponse(Damages entity);
}
