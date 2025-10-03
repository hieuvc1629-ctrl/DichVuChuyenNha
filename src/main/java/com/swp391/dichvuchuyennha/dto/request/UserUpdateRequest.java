package com.swp391.dichvuchuyennha.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class UserUpdateRequest {
    String username;
    String email;
    String phone;
    String password; // optional, nếu user muốn đổi
}
