package com.myfcseoul.backend.service;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

@Component
public class CustomOAuth2AuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    // 성공 후 리다이렉트할 프론트엔드 URL
    private static final String REDIRECT_URL = "https://www.myfcseoul.com/";

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        response.sendRedirect(REDIRECT_URL);
    }
}
