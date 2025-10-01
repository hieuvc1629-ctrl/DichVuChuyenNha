package com.swp391.dichvuchuyennha.mapper;

import com.swp391.dichvuchuyennha.dto.request.UserCreateRequest;
import com.swp391.dichvuchuyennha.dto.response.UserResponse;
import com.swp391.dichvuchuyennha.entity.Users;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    // Map từ request sang entity (bỏ qua các field không cần set khi create)
    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "employee", ignore = true)
    @Mapping(target = "customerCompany", ignore = true)
    @Mapping(target = "contractsSigned", ignore = true)
    @Mapping(target = "feedbacks", ignore = true)
    @Mapping(target = "notifications", ignore = true)
    @Mapping(target = "requests", ignore = true)
    Users toUsersCreateRequest(UserCreateRequest request);

    // Map từ entity sang response
    UserResponse toUserResponse(Users users);
}

