package com.swp391.dichvuchuyennha.service;

import com.swp391.dichvuchuyennha.dto.request.CustomerCompanyRequest;
import com.swp391.dichvuchuyennha.dto.request.EmployeeCreateRequest;
import com.swp391.dichvuchuyennha.dto.request.UserCreateRequest;
import com.swp391.dichvuchuyennha.dto.response.UserResponse;
import com.swp391.dichvuchuyennha.entity.CustomerCompany;
import com.swp391.dichvuchuyennha.entity.Employee;
import com.swp391.dichvuchuyennha.entity.Roles;
import com.swp391.dichvuchuyennha.entity.Users;
import com.swp391.dichvuchuyennha.exception.AppException;
import com.swp391.dichvuchuyennha.exception.ErrorCode;

import com.swp391.dichvuchuyennha.repository.CustomerCompanyRepository;

import com.swp391.dichvuchuyennha.mapper.UserMapper;

import com.swp391.dichvuchuyennha.repository.RoleRepository;
import com.swp391.dichvuchuyennha.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    private final CustomerCompanyRepository customerCompanyRepository;
=======
    @Autowired
    UserMapper userMapper;

    private final RoleRepository roleRepository;

    private final PasswordEncoder passwordEncoder;

    public UserResponse createUser(UserCreateRequest request) {
        Roles role = roleRepository.findById(request.getRoleId())
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_EXISTED));

        Users user = new Users();

        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setRole(role);

        user = userRepository.save(user);

        return UserResponse.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .email(user.getEmail())
                .phone(user.getPhone())
                .roleName(role.getRoleName())
                .build();

        userMapper.toUsers(user);
        user = userRepository.save(user);

        return userMapper.toUserResponse(user);

    }

    public UserResponse createCustomerCompanyUser(CustomerCompanyRequest req) {
        // check duplicate
        if (userRepository.existsByUsername(req.getUsername())) {
            throw new AppException(ErrorCode.USERNAME_EXISTED);
        }
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new AppException(ErrorCode.EMAIL_EXISTED);
        }

        Roles customerCompanyRole = roleRepository.findByRoleName("customer_company")
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_EXISTED));

        
        Users user = new Users();
        user.setUsername(req.getUsername());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setEmail(req.getEmail());
        user.setPhone(req.getPhone());
        user.setRole(customerCompanyRole);

        Users savedUser = userRepository.save(user);

        CustomerCompany customerCompany = new CustomerCompany();
        customerCompany.setUser(savedUser);
        customerCompany.setCompanyName(req.getCompanyName());
        customerCompany.setTaxCode(req.getTaxCode());
        customerCompany.setAddress(req.getAddress());
        customerCompany.setEmail(req.getEmail());
        customerCompany.setPhone(req.getPhone());

        customerCompanyRepository.save(customerCompany);

        return UserResponse.builder()
                .userId(savedUser.getUserId())
                .username(savedUser.getUsername())
                .email(savedUser.getEmail())
                .phone(savedUser.getPhone())
                .roleName(customerCompanyRole.getRoleName())
                .build();
    }
}




