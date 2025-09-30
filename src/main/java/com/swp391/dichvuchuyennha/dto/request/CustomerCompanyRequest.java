package com.swp391.dichvuchuyennha.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class CustomerCompanyRequest {
     String username;
     String password;
     String email;
     String phone;
     String companyName;
     String taxCode;
     String address;
}
