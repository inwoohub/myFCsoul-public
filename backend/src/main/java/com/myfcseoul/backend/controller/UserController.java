package com.myfcseoul.backend.controller;

import com.myfcseoul.backend.model.User;
import com.myfcseoul.backend.repository.UserRepository;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/api/user")
    public User getUser(@AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            // 로그인되지 않은 경우 null을 반환하거나 적절한 응답 처리를 진행합니다.
            return null;
        }
        // OAuth2User의 attributes에서 카카오 고유 id를 추출합니다.
        String kakaoId = String.valueOf(principal.getAttributes().get("id"));
        // user_id 컬럼을 기준으로 조회합니다.
        Optional<User> optionalUser = userRepository.findByUserId(kakaoId);
        return optionalUser.orElse(null);
    }
}
