package com.swp391.dichvuchuyennha.dto.response;

<<<<<<< Updated upstream
<<<<<<< Updated upstream
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
=======
import lombok.*;
import lombok.experimental.FieldDefaults;
>>>>>>> Stashed changes

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class UserResponse {
<<<<<<< Updated upstream
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
=======
>>>>>>> Stashed changes
    Integer userId;
    String username;
    String email;
    String phone;
    String roleName;
}
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
