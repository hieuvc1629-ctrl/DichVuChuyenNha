package com.swp391.dichvuchuyennha.service;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.swp391.dichvuchuyennha.entity.Users;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.time.Instant;
import java.util.Date;

@Service
public class JwtService {

    @Value("${jwt.signerKey}")
    private String signerKey;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    public String generateToken(Users user) {
        try {
            // Tạo JWT Claims Set với thông tin user
            JWTClaimsSet.Builder claimsBuilder = new JWTClaimsSet.Builder()
                    .subject(user.getUsername())
                    .issueTime(new Date())
                    .expirationTime(new Date(Instant.now().toEpochMilli() + jwtExpiration))
                    .claim("userId", user.getUserId())
                    .claim("username", user.getUsername())
                    .claim("email", user.getEmail())
                    .claim("phone", user.getPhone());

            // Thêm role nếu có
            if (user.getRole() != null) {
                claimsBuilder.claim("role", user.getRole().getRoleName());
                claimsBuilder.claim("roleId", user.getRole().getRoleId());
            }

            JWTClaimsSet claimsSet = claimsBuilder.build();

            // Tạo JWT với HS256
            SignedJWT signedJWT = new SignedJWT(
                    new JWSHeader(JWSAlgorithm.HS256),
                    claimsSet
            );

            // Ký token
            JWSSigner signer = new MACSigner(signerKey);
            signedJWT.sign(signer);

            return signedJWT.serialize();

        } catch (JOSEException e) {
            throw new RuntimeException("Error generating JWT token", e);
        }
    }

    public boolean validateToken(String token) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            com.nimbusds.jose.crypto.MACVerifier verifier = new com.nimbusds.jose.crypto.MACVerifier(signerKey);
            
            return signedJWT.verify(verifier) && 
                   !signedJWT.getJWTClaimsSet().getExpirationTime().before(new Date());
        } catch (ParseException | JOSEException e) {
            return false;
        }
    }


}
