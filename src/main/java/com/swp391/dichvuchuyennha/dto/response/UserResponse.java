package com.swp391.dichvuchuyennha.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class UserResponse {
    Integer userId;
    String username;
    String email;
    String phone;
    String roleName;

}
