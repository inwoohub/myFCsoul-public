package com.myfcseoul.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class OpenAiClientService {
    private final String apiKey;
    private final RestTemplate rest = new RestTemplate();

    public OpenAiClientService(@Value("${openai.api.key}") String apiKey) {
        this.apiKey = apiKey;
    }

    public String getPrediction(String prompt) {
        String url = "https://api.openai.com/v1/chat/completions";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(apiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        // OpenAI Chat API 요청 바디
        Map<String,Object> body = Map.of(
                "model", "gpt-4.1-mini",
                "messages", List.of(Map.of("role", "user", "content", prompt)),
                "temperature", 0.2
        );

        HttpEntity<Map<String,Object>> request = new HttpEntity<>(body, headers);
        ResponseEntity<Map> response = rest.exchange(
                url, HttpMethod.POST, request, Map.class
        );

        // 응답에서 choices[0].message.content 추출
        List<?> choices = (List<?>) response.getBody().get("choices");
        Map<?,?> first  = (Map<?,?>) choices.get(0);
        Map<?,?> message = (Map<?,?>) first.get("message");
        return message.get("content").toString().trim();
    }
}
