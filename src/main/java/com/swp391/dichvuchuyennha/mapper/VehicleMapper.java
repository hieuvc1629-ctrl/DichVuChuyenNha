package com.swp391.dichvuchuyennha.mapper;

import com.swp391.dichvuchuyennha.dto.request.VehicleCreateRequest;
import com.swp391.dichvuchuyennha.dto.response.VehicleResponse;
import com.swp391.dichvuchuyennha.entity.Vehicles;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface VehicleMapper {
    Vehicles toEntity(VehicleCreateRequest request);

    VehicleResponse toResponse(Vehicles vehicle);

    void updateFromRequest(VehicleCreateRequest request, @MappingTarget Vehicles vehicle);
}