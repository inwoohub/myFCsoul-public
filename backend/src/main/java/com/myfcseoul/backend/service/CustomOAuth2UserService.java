package com.myfcseoul.backend.service;

import com.myfcseoul.backend.model.User;
import com.myfcseoul.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;

import java.util.Collection;
import java.util.List;
import java.time.LocalDateTime;
import java.util.Map;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private static final Logger logger = LoggerFactory.getLogger(CustomOAuth2UserService.class);
    private final UserRepository userRepository;

    public CustomOAuth2UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        logger.info("CustomOAuth2UserService.loadUser 호출됨.");
        OAuth2User oauth2User = super.loadUser(userRequest);

        Map<String, Object> attributes = oauth2User.getAttributes();
        logger.info("Kakao attributes: {}", attributes);

        // Kakao API 응답에서 "id"가 카카오 사용자의 고유 ID입니다.
        String kakaoId = String.valueOf(attributes.get("id"));
        logger.info("Extracted kakaoId: {}", kakaoId);

        // "kakao_account"에서 추가 정보를 추출 (이메일은 사용하지 않음)
        Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");

        // "profile" 내에서 닉네임을 추출합니다.
        Map<String, Object> profile = kakaoAccount != null ? (Map<String, Object>) kakaoAccount.get("profile") : null;
        String nickname = (profile != null && profile.get("nickname") != null)
                ? (String) profile.get("nickname")
                : "Unknown";
        logger.info("Extracted nickname: {}", nickname);

        // DB에서 카카오 고유 ID(userId)로 사용자 조회, 없으면 새로 생성합니다.
        User user = userRepository.findByUserId(kakaoId)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setUserId(kakaoId);          // 카카오 고유 ID를 userId 필드에 저장
                    newUser.setNickname(nickname);
                    newUser.setCreatedAt(LocalDateTime.now());
                    // 새로 생성하는 경우 기본 role을 "user"로 지정합니다.
                    newUser.setRole("user");
                    return newUser;
                });

        // 기존 사용자라도 nickname이 없는 경우 업데이트
        if (user.getNickname() == null || user.getNickname().isEmpty()) {
            user.setNickname(nickname);
        }

        // ★★ 핵심: DB role 값을 그대로 권한으로 부여 ("admin" / "user")
        Collection<? extends GrantedAuthority> authorities =
                List.of(new SimpleGrantedAuthority(user.getRole()));

        // Kakao의 nameAttributeKey는 "id" 를 쓰면 됩니다.
        DefaultOAuth2User principal = new DefaultOAuth2User(
                authorities,
                attributes,
                "id"
        );

        logger.info("저장하기 전 User 정보: userId={}, nickname={}, role={}", user.getUserId(), user.getNickname(), user.getRole());
        userRepository.save(user);
        logger.info("사용자 저장 완료.");
        logger.info("로그인 사용자 권한: {}", principal.getAuthorities());

        return principal;
    }
}
