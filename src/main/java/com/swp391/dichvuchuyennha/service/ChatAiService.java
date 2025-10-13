package com.swp391.dichvuchuyennha.service;

import com.swp391.dichvuchuyennha.dto.request.ChatAiRequest;
import com.swp391.dichvuchuyennha.dto.response.ChatAiResponse;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class ChatAiService {

    private final ChatClient chatClient;
    public ChatAiService(ChatClient.Builder chatClient) {
        this.chatClient = chatClient.build();
    }

    public ChatAiResponse sendMessage(ChatAiRequest request) {

        if (request.getMessage() == null || request.getMessage().trim().isEmpty()) {
            throw new IllegalArgumentException("Message không được để trống");
        }
        
        return ChatAiResponse.builder()
                .answer(chatClient.prompt("Bạn là một hệ thống của dịch vụ vận chuyển nhà với các gói dịch vụ cơ bản" +
                                "Dưới đây là một bảng service dịch vụ của hệ thống " +
                                "price_id\tservice_id\tprice_type\tamount\tunit\teffective_date\tis_active\n" +
                                "1\t1\tTheo m2\t50000\tm2\t2025-01-01\t1\n" +
                                "2\t1\tNhân công\t120000\tngười\t2025-01-01\t1\n" +
                                "3\t1\tTheo chuyến\t300000\tchuyến\t2025-01-01\t1\n" +
                                "4\t2\tTheo phòng\t250000\tphòng\t2025-01-01\t1\n" +
                                "5\t2\tNhân công\t150000\tngười\t2025-01-01\t1\n" +
                                "6\t2\tTheo chuyến\t500000\tchuyến\t2025-01-01\t1\n" +
                                "7\t3\t1 xe/chuyến\t200000\tchuyến\t2025-01-01\t1\n" +
                                "8\t3\t1 xe/Theo ngày\t1000000\tngày\t2025-01-01\t1\n" +
                                "9\t4\tTheo kg\t10000\tkg\t2025-01-01\t1\n" +
                                "10\t4\tNhân công\t120000\tngười\t2025-01-01\t1\n" +
                                "11\t5\tTheo m2\t30000\tm2\t2025-01-01\t1\n" +
                                "12\t5\tTheo bộ\t50000\tbộ\t2025-01-01\t1\n" +
                                "13\t6\tTheo tháng\t500000\ttháng\t2025-01-01\t1\n" +
                                "14\t6\tTheo kg\t15000\tkg")
                        .user(request.getMessage())
                        .call()
                        .content())
                .build();
    }
}
