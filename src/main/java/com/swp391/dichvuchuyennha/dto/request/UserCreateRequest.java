package com.swp391.dichvuchuyennha.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class UserCreateRequest {
    String username;
    String password;
    Integer roleId;
    String email;
    String phone;

}
