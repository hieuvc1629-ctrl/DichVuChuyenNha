package com.swp391.dichvuchuyennha.dto.response;

<<<<<<< Updated upstream
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {
    private Integer userId;
    private String username;
    private String email;
    private String phone;
    private String roleName;
    private Integer roleId;
}
=======
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
>>>>>>> Stashed changes
