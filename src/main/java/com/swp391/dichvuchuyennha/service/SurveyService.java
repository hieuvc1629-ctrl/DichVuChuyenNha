package com.swp391.dichvuchuyennha.service;

import com.swp391.dichvuchuyennha.dto.request.SurveyRequest;
import com.swp391.dichvuchuyennha.dto.response.SurveyResponse;
import com.swp391.dichvuchuyennha.entity.Employee;
import com.swp391.dichvuchuyennha.entity.RequestAssignment;
import com.swp391.dichvuchuyennha.entity.Requests;
import com.swp391.dichvuchuyennha.entity.Surveys;
import com.swp391.dichvuchuyennha.exception.AppException;
import com.swp391.dichvuchuyennha.exception.ErrorCode;
import com.swp391.dichvuchuyennha.external.DistanceCalculator;
import com.swp391.dichvuchuyennha.mapper.SurveyMapper;
import com.swp391.dichvuchuyennha.repository.EmployeeRepository;
import com.swp391.dichvuchuyennha.repository.RequestAssignmentRepository;
import com.swp391.dichvuchuyennha.repository.RequestRepository;
import com.swp391.dichvuchuyennha.repository.SurveyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SurveyService {
    private final SurveyMapper surveyMapper;
    private final SurveyRepository surveyRepository;
    private final RequestRepository requestRepository;
    private final EmployeeRepository employeeRepository;
    private final RequestAssignmentRepository requestAssignmentRepository;
    public Surveys createSurvey(SurveyRequest dto) {
        Surveys survey = surveyMapper.toEntity(dto);

        Requests request = requestRepository.findById(dto.getRequestId())
                .orElseThrow(() -> new AppException(ErrorCode.SURVEY_NOT_FOUND));

        survey.setRequest(request);
        // Có thể set mặc định status nếu muốn
        if (survey.getStatus() == null) {
            survey.setStatus("Pending");
        }
        request.setStatus("DONE");
        requestRepository.save(request);



        return surveyRepository.save(survey);
    }
    @Transactional(readOnly = true)
    public List<SurveyResponse> getSurveysByCurrentEmployee() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        String username = auth.getName();

        List<Surveys> surveys = surveyRepository.findByRequest_AssignedEmployees_Employee_User_Username(username);

        return surveys.stream()
                .map(surveyMapper::toResponse)
                .collect(Collectors.toList());

    }
    public SurveyResponse updateSurvey(Integer id, SurveyRequest dto) {
        Surveys survey = surveyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Survey not found"));

        // update fields
        survey.setSurveyDate(dto.getSurveyDate());
        survey.setAddressFrom(dto.getAddressFrom());
        survey.setAddressTo(dto.getAddressTo());
        survey.setStatus(dto.getStatus());
        survey.setEstimatedWorkers(dto.getEstimatedWorkers());

        return surveyMapper.toResponse(surveyRepository.save(survey));
    }

    public void deleteSurvey(Integer id) {
        if (!surveyRepository.existsById(id)) {
            throw new RuntimeException("Survey not found");
        }
        surveyRepository.deleteById(id);
    }
}
