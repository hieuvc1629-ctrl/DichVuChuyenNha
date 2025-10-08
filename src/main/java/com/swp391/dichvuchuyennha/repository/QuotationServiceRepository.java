package com.swp391.dichvuchuyennha.repository;

import com.swp391.dichvuchuyennha.entity.QuotationServices;
import com.swp391.dichvuchuyennha.entity.Quotations;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuotationServiceRepository extends JpaRepository<QuotationServices,Integer> {
    List<QuotationServices> findByQuotation(Quotations quotation);

}
