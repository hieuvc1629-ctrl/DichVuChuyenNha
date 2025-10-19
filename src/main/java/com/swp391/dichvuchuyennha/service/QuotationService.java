package com.swp391.dichvuchuyennha.service;

import com.swp391.dichvuchuyennha.dto.request.QuotationCreateRequest;
import com.swp391.dichvuchuyennha.dto.response.QuotationForCustomer;
import com.swp391.dichvuchuyennha.dto.response.QuotationResponse;
import com.swp391.dichvuchuyennha.entity.QuotationServices;
import com.swp391.dichvuchuyennha.entity.Quotations;
import com.swp391.dichvuchuyennha.entity.Surveys;
import com.swp391.dichvuchuyennha.exception.AppException;
import com.swp391.dichvuchuyennha.exception.ErrorCode;
import com.swp391.dichvuchuyennha.mapper.QuotationForCustomerMapper;
import com.swp391.dichvuchuyennha.mapper.QuotationMapper;
import com.swp391.dichvuchuyennha.repository.QuotationRepository;
import com.swp391.dichvuchuyennha.repository.QuotationServiceRepository;
import com.swp391.dichvuchuyennha.repository.SurveyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuotationService {

    private final QuotationRepository quotationRepository;
    private final SurveyRepository surveyRepository;
    private final QuotationServiceRepository quotationServiceRepository;
    private final QuotationMapper quotationMapper;
    private final QuotationForCustomerMapper quotationForCustomerMapper;
    private final NotificationService notificationService;

    public Quotations createQuotation(QuotationCreateRequest request) {
        // Map từ DTO -> Entity (chưa có survey)
        Quotations quotation = quotationMapper.toEntity(request);

        // Gán survey từ DB theo surveyId
        Surveys survey = surveyRepository.findById(request.getSurveyId())
                .orElseThrow(() -> new AppException(ErrorCode.QUOTATION_NOT_FOUND));

        quotation.setSurvey(survey);
        quotation.setTotalPrice(0.0);
        // Cập nhật trạng thái thành PENDING
        quotation.setStatus("PENDING");
        survey.setStatus("QUOTED");
        // Lưu vào DB
        return quotationRepository.save(quotation);
    }

    public List<QuotationResponse> getQuotationsByCurrentEmployee() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return quotationRepository.findBySurvey_Request_AssignedEmployees_Employee_User_Username(username)
                .stream()
                .map(quotationMapper::toResponse)
                .collect(Collectors.toList());
    }


    public List<QuotationForCustomer> getPendingQuotationsByUserId(Integer userId) {
        // Lấy danh sách QuotationServices có trạng thái PENDING cho userId
        List<QuotationServices> quotationServices = quotationServiceRepository
                .findByQuotation_Survey_Request_User_UserIdAndQuotation_Status(userId, "PENDING");

        // Nhóm QuotationServices theo Quotation và ánh xạ sang QuotationForCustomer
        return quotationServices.stream()
                .collect(Collectors.groupingBy(
                        QuotationServices::getQuotation,
                        Collectors.toList()
                ))
                .entrySet().stream()
                .map(entry -> quotationForCustomerMapper.toInfo(entry.getValue().get(0)))
                .collect(Collectors.toList());
    }

    public QuotationForCustomer approveQuotation(Integer quotationId, Integer userId) {
        // 1. Tìm quotation theo ID
        Quotations quotation = quotationRepository.findById(quotationId)
                .orElseThrow(() -> new AppException(ErrorCode.QUOTATION_NOT_FOUND));

        // 2. Kiểm tra xem quotation này có thuộc về user đang login không
        if (!quotation.getSurvey().getRequest().getUser().getUserId().equals(userId)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        // 3. Kiểm tra trạng thái
        if (!"PENDING".equalsIgnoreCase(quotation.getStatus())) {
            throw new AppException(ErrorCode.INVALID_STATUS);
        }

        // 4. Cập nhật status thành APPROVED
        quotation.setStatus("APPROVED");
        quotationRepository.save(quotation);

        // 5. Trả về DTO cho FE
        // Vì mapper của bạn map từ QuotationServices, ta lấy 1 service bất kỳ của quotation
        List<QuotationServices> services = quotation.getQuotationServices();
        if (services == null || services.isEmpty()) {
            throw new AppException(ErrorCode.QUOTATION_SERVICE_NOT_FOUND);
        }

        return quotationForCustomerMapper.toInfo(services.get(0));

    }
    public QuotationForCustomer rejectQuotation(Integer quotationId, Integer userId) {
        // 1. Tìm quotation theo ID
        Quotations quotation = quotationRepository.findById(quotationId)
                .orElseThrow(() -> new AppException(ErrorCode.QUOTATION_NOT_FOUND));

        // 2. Kiểm tra xem quotation này có thuộc về user đang đăng nhập không
        if (!quotation.getSurvey().getRequest().getUser().getUserId().equals(userId)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        // 3. Kiểm tra trạng thái, chỉ cho phép từ PENDING mới được từ chối
        if (!"PENDING".equalsIgnoreCase(quotation.getStatus())) {
            throw new AppException(ErrorCode.INVALID_STATUS);
        }

        // 4. Cập nhật trạng thái thành REJECTED
        quotation.setStatus("REJECTED");
        quotationRepository.save(quotation);

        // 5. Trả về DTO cho FE
        List<QuotationServices> services = quotation.getQuotationServices();
        if (services == null || services.isEmpty()) {
            throw new AppException(ErrorCode.QUOTATION_SERVICE_NOT_FOUND);
        }

        return quotationForCustomerMapper.toInfo(services.get(0));
    }



    public List<QuotationResponse> getAllQuotations() {
        return quotationRepository.findByStatus("APPROVED").stream()  // <- Lọc APPROVED
                .map(quotationMapper::toResponse)
                .collect(Collectors.toList());
    }

}