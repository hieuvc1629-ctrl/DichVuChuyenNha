package com.swp391.dichvuchuyennha.service;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.swp391.dichvuchuyennha.dto.request.AuthenticationRequest;
import com.swp391.dichvuchuyennha.dto.response.AuthenticationResponse;
import com.swp391.dichvuchuyennha.entity.Users;
import com.swp391.dichvuchuyennha.exception.AppException;
import com.swp391.dichvuchuyennha.exception.ErrorCode;
import com.swp391.dichvuchuyennha.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder; // inject bean từ config

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expirationSec}")
    private long jwtExpirationSec;


    private final Set<String> blacklistedTokens = ConcurrentHashMap.newKeySet();


    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        Users user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        boolean authenticated = passwordEncoder.matches(request.getPassword(), user.getPassword());
        if (!authenticated) throw new AppException(ErrorCode.UNAUTHENTICATED);

        String token = generateToken(user);
        return AuthenticationResponse.builder()
                .token(token)
                .authenticated(true)
                .userId(user.getUserId())       // thêm
                .username(user.getUsername())   // thêm
                .build();
    }


    private String generateToken(Users user) {
        try {
            JWTClaimsSet claims = new JWTClaimsSet.Builder()
                    .subject(user.getUsername())
                    .issuer("moving-service.com")
                    .issueTime(new Date())
                    .expirationTime(Date.from(Instant.now().plusSeconds(jwtExpirationSec)))
                    .jwtID(UUID.randomUUID().toString())
                    .claim("roles", List.of(user.getRole().getRoleName()))
                    .claim("userId", user.getUserId())
                    .build();

            JWSHeader header = new JWSHeader(JWSAlgorithm.HS256);
            SignedJWT signedJWT = new SignedJWT(header, claims);
            signedJWT.sign(new MACSigner(jwtSecret.getBytes()));

            return signedJWT.serialize();
        } catch (Exception e) {
            throw new RuntimeException("Cannot create JWT token", e);
        }
    }

    /** Kiểm tra và parse token */
    public Users verifyAndParseToken(String token) {
        try {
            if (blacklistedTokens.contains(token)) {
                throw new AppException(ErrorCode.UNAUTHENTICATED); // token đã logout
            }

            SignedJWT signedJWT = SignedJWT.parse(token);
            JWSVerifier verifier = new MACVerifier(jwtSecret.getBytes());

            boolean valid = signedJWT.verify(verifier);
            if (!valid) throw new AppException(ErrorCode.UNAUTHENTICATED);

            Date expiry = signedJWT.getJWTClaimsSet().getExpirationTime();
            if (expiry.before(new Date())) throw new AppException(ErrorCode.UNAUTHENTICATED);

            String username = signedJWT.getJWTClaimsSet().getSubject();
            return userRepository.findByUsername(username)
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        } catch (ParseException | JOSEException e) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
    }

    /** Logout: đưa token vào blacklist */
    public void logout(String token) {
        blacklistedTokens.add(token);
    }

}
