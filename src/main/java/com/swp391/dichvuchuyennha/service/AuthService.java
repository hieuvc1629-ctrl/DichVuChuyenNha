package com.swp391.dichvuchuyennha.service;

import com.swp391.dichvuchuyennha.dto.request.LoginRequest;
import com.swp391.dichvuchuyennha.dto.request.RegisterRequest;
import com.swp391.dichvuchuyennha.dto.response.LoginResponse;
import com.swp391.dichvuchuyennha.entity.Roles;
import com.swp391.dichvuchuyennha.entity.Users;
import com.swp391.dichvuchuyennha.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserService userService;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;

    public LoginResponse authenticate(LoginRequest loginRequest) {
        Optional<Users> userOptional = userService.findByUsername(loginRequest.getUsername());
        
        if (userOptional.isEmpty()) {
            throw new RuntimeException("Invalid username or password");
        }
        Users user = userOptional.get();

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }

        // Tạo JWT token với thông tin user
        String token = jwtService.generateToken(user);

        return LoginResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .build();
    }

    public Users register(RegisterRequest registerRequest) {

        if (userService.existsByUsername(registerRequest.getUsername())) {
            throw new RuntimeException("Username already exists");
        }


        if (userService.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // Tìm role theo roleId, nếu không có thì mặc định là roleId = 1 (CUSTOMER)
        Roles role;
        if (registerRequest.getRoleId() != null) {
            role = roleRepository.findByRoleId(registerRequest.getRoleId())
                    .orElseThrow(() -> new RuntimeException("Role not found"));
        } else {
            // Mặc định role là CUSTOMER (roleId = 1)
            role = roleRepository.findByRoleId(1)
                    .orElseThrow(() -> new RuntimeException("Default role not found"));
        }

        Users newUser = new Users();
        newUser.setUsername(registerRequest.getUsername());
        newUser.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        newUser.setEmail(registerRequest.getEmail());
        newUser.setPhone(registerRequest.getPhone());
        newUser.setRole(role);


        return userService.save(newUser);
    }
}
