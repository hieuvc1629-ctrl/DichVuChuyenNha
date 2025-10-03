package com.swp391.dichvuchuyennha.service;

import com.swp391.dichvuchuyennha.dto.request.CreateContractRequest;
import com.swp391.dichvuchuyennha.dto.response.ManagerContractInfoDTO;
import com.swp391.dichvuchuyennha.dto.response.QuotationServiceDTO;
import com.swp391.dichvuchuyennha.dto.response.VehicleDTO;
import com.swp391.dichvuchuyennha.entity.Contract;
import com.swp391.dichvuchuyennha.entity.Quotations;
import com.swp391.dichvuchuyennha.entity.Requests;
import com.swp391.dichvuchuyennha.repository.ContractRepository;
import com.swp391.dichvuchuyennha.repository.QuotationRepository;
import com.swp391.dichvuchuyennha.repository.RequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ManagerContractService {

    private final RequestRepository requestRepository;
    private final ContractRepository contractRepository;
    private final QuotationRepository quotationRepository;
    public List<ManagerContractInfoDTO> getContractsForManager() {
        List<Requests> requests = requestRepository.findByStatus("PENDING");

        return requests.stream()
                .flatMap(request ->
                        request.getSurveys().stream()
                                .filter(survey -> "DONE".equalsIgnoreCase(survey.getStatus()))
                                .flatMap(survey ->
                                        survey.getQuotations().stream()
                                                .filter(quotation -> quotation.getContracts().isEmpty())

                                                .map(quotation -> ManagerContractInfoDTO.builder()
                                                        .requestId(request.getRequestId())
                                                        .requestDescription(request.getDescription())
                                                        .requestTime(request.getRequestTime())
                                                        .requestStatus(request.getStatus())
                                                        .customerName(request.getUser().getUsername())
                                                        .customerEmail(request.getUser().getEmail())
                                                        .customerPhone(request.getUser().getPhone())
                                                        .customerCompanyName(request.getBusiness() != null ? request.getBusiness().getCompanyName() : null)
                                                        .surveyId(survey.getSurveyId())
                                                        .surveyDate(survey.getSurveyDate())
                                                        .addressFrom(survey.getAddressFrom())
                                                        .addressTo(survey.getAddressTo())
                                                        .surveyStatus(survey.getStatus())
                                                        .quotationId(quotation.getQuotationId())
                                                        .totalPrice(quotation.getTotalPrice())
                                                        .quotationCreatedAt(quotation.getCreatedAt())
                                                        .quotationServices(quotation.getQuotationServices().stream()
                                                                .map(qs -> new QuotationServiceDTO(qs.getService().getServiceName(), qs.getPrice().getAmount()))
                                                                .toList())

                                                        .contractId(quotation.getContracts().isEmpty() ? null : quotation.getContracts().get(0).getContractId())
                                                        .startDate(quotation.getContracts().isEmpty() ? null : quotation.getContracts().get(0).getStartDate())
                                                        .endDate(quotation.getContracts().isEmpty() ? null : quotation.getContracts().get(0).getEndDate())
                                                        .depositAmount(quotation.getContracts().isEmpty() ? null : quotation.getContracts().get(0).getDepositAmount())
                                                        .totalAmount(quotation.getContracts().isEmpty() ? null : quotation.getContracts().get(0).getTotalAmount())
                                                        .contractStatus(quotation.getContracts().isEmpty() ? null : quotation.getContracts().get(0).getStatus())
                                                        .signedBy(quotation.getContracts().isEmpty() || quotation.getContracts().get(0).getSignedBy() == null
                                                                ? null : quotation.getContracts().get(0).getSignedBy().getUsername())
                                                        .signedDate(quotation.getContracts().isEmpty() ? null : quotation.getContracts().get(0).getSignedDate())
                                                        .build()
                                                )
                                )
                ).toList();
    }
    @Transactional
    public Contract createContract(CreateContractRequest request) {
        Quotations quotation = quotationRepository.findById(request.getQuotationId())
                .orElseThrow(() -> new RuntimeException("Quotation not found"));

        if (!quotation.getContracts().isEmpty()) {
            throw new RuntimeException("Contract already exists for this quotation");
        }

        Contract contract = new Contract();
        contract.setQuotation(quotation);
        contract.setSignedBy(quotation.getSurvey().getRequest().getUser()); // owner = khách hàng tạo request
        contract.setStartDate(request.getStartDate());
        contract.setEndDate(request.getEndDate());
        contract.setDepositAmount(request.getDepositAmount());
        contract.setTotalAmount(request.getTotalAmount());
        contract.setStatus("UNSIGNED"); // mặc định chưa ký

        return contractRepository.save(contract);
    }
}
