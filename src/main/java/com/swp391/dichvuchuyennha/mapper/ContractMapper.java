package com.swp391.dichvuchuyennha.mapper;

import com.swp391.dichvuchuyennha.dto.response.ContractResponse;
import com.swp391.dichvuchuyennha.entity.Contract;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ContractMapper {

    // Map entity -> dto
    @Mapping(target = "contractId", source = "contractId")
    @Mapping(target = "signedById", source = "signedBy.userId")
    @Mapping(target = "signedByUsername", source = "signedBy.username")
    @Mapping(target = "startLocation", source = "quotation.survey.addressFrom")
    @Mapping(target = "endLocation", source = "quotation.survey.addressTo")

    ContractResponse toResponse(Contract contract);

}
