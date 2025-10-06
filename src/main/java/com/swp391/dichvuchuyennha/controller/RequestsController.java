package com.swp391.dichvuchuyennha.controller;

import com.swp391.dichvuchuyennha.dto.request.ApiResponse;
import com.swp391.dichvuchuyennha.dto.request.RequestCreateRequest;
import com.swp391.dichvuchuyennha.dto.request.SurveyRequest;
import com.swp391.dichvuchuyennha.dto.response.RequestDto;
import com.swp391.dichvuchuyennha.dto.response.RequestResponse;
import com.swp391.dichvuchuyennha.dto.response.SurveyResponse;
import com.swp391.dichvuchuyennha.entity.Users;
import com.swp391.dichvuchuyennha.repository.RequestRepository;
import com.swp391.dichvuchuyennha.service.RequestService;
import com.swp391.dichvuchuyennha.repository.UserRepository;
import com.swp391.dichvuchuyennha.service.SurveyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor
public class RequestsController {

    private final RequestService requestService;
    private final UserRepository userRepository;
    private final RequestRepository requestRepository;
    private final SurveyService surveyService;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<RequestResponse>> create(@Valid @RequestBody RequestCreateRequest requestDto) {
        String context = SecurityContextHolder.getContext().getAuthentication().getName();

        Users user = userRepository.findByUsername(context).orElseThrow();
        RequestResponse data = requestService.createRequest(user, requestDto);
        return ResponseEntity.ok(ApiResponse.<RequestResponse>builder().result(data).build());
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<RequestResponse>>> getMyRequests() {
        String context = SecurityContextHolder.getContext().getAuthentication().getName();
        Users user = userRepository.findByUsername(context).orElseThrow();
        List<RequestResponse> data = requestService.getMyRequests(user);
        return ResponseEntity.ok(ApiResponse.<List<RequestResponse>>builder().result(data).build());
    }
    @GetMapping
    public List<RequestDto> getAllRequests() {
        return requestRepository.findAll()
                .stream()
                .map(r -> RequestDto.builder()
                        .requestId(r.getRequestId())
                        .username(r.getUser() != null ? r.getUser().getUsername() : "N/A")
                        .companyName(r.getBusiness() != null ? r.getBusiness().getCompanyName() : "N/A")
                        .build()
                ).collect(Collectors.toList());
    }



}


