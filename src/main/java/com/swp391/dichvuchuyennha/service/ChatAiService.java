package com.swp391.dichvuchuyennha.service;

import com.swp391.dichvuchuyennha.dto.request.ChatAiRequest;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class ChatAiService {

    private final ChatClient chatClient;
    public ChatAiService(ChatClient.Builder chatClient) {
        this.chatClient = chatClient.build();
    }

    public String sendMessage(ChatAiRequest request) {
        return chatClient.prompt(" Bạn là một hệ thống của dịch vụ vận chuyển nhà với các gói dịch vụ cơ bản")
                .user(request.getMessage())
                .call()
                .content();
    }
}
