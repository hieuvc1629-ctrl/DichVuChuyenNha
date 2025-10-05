package com.swp391.dichvuchuyennha.controller;

import com.swp391.dichvuchuyennha.dto.request.SurveyRequest;
import com.swp391.dichvuchuyennha.dto.response.SurveyResponse;
import com.swp391.dichvuchuyennha.entity.Surveys;
import com.swp391.dichvuchuyennha.mapper.SurveyMapper;
import com.swp391.dichvuchuyennha.service.SurveyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/surveys")
@RequiredArgsConstructor
public class SurveyController {

    private final SurveyService surveyService;
    private final SurveyMapper surveyMapper;

    // API tạo survey mới
    @PostMapping
    @PreAuthorize("hasRole('manager')") // Chỉ manager tạo survey
    public ResponseEntity<SurveyResponse> createSurvey(@RequestBody SurveyRequest dto) {
        Surveys savedSurvey = surveyService.createSurvey(dto);
        SurveyResponse response = surveyMapper.toResponse(savedSurvey);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('manager', 'admin')") // Manager/ admin xem all
    public ResponseEntity<List<SurveyResponse>> listAllSurveys() {
        List<SurveyResponse> surveys = surveyService.getAllSurveys();
        return ResponseEntity.ok(surveys);
    }
}