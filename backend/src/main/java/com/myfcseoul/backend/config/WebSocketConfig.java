// src/main/java/com/myfcseoul/backend/config/WebSocketConfig.java
package com.myfcseoul.backend.config;

import org.springframework.web.socket.config.annotation.*;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;


@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry
                .addEndpoint("/ws-chat")
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // 클라이언트에서 /app/** 로 메시지 보냄
        registry.setApplicationDestinationPrefixes("/app");

        // 서버에서 클라이언트로 보낼 때는 /user/{userId}/queue/** 사용
        registry.enableSimpleBroker("/queue");
    }
}
