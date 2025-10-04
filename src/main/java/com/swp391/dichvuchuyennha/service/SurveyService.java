package com.swp391.dichvuchuyennha.service;

import com.swp391.dichvuchuyennha.dto.request.SurveyRequest;
import com.swp391.dichvuchuyennha.dto.response.SurveyResponse;
import com.swp391.dichvuchuyennha.entity.Requests;
import com.swp391.dichvuchuyennha.entity.Surveys;
import com.swp391.dichvuchuyennha.mapper.SurveyMapper;
import com.swp391.dichvuchuyennha.repository.RequestRepository;
import com.swp391.dichvuchuyennha.repository.SurveyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SurveyService {
    private final SurveyMapper surveyMapper;
    private final SurveyRepository surveyRepository;
    private final RequestRepository requestRepository;

    public Surveys createSurvey(SurveyRequest dto) {
        Surveys survey = surveyMapper.toEntity(dto);
        Requests request = requestRepository.findById(Integer.parseInt(dto.getRequestId()))
                .orElseThrow(() -> new RuntimeException("Request không tồn tại"));

        survey.setRequest(request); // gán đầy đủ
        return surveyRepository.save(survey);
    }
    public List<SurveyResponse> getAllSurveys() {
        List<Surveys> surveys = surveyRepository.findAll();
        return surveys.stream()
                .map(surveyMapper::toResponse)
                .collect(Collectors.toList());
    }
}
