
package com.myfcseoul.backend.controller;

import com.myfcseoul.backend.dto.ProfileUpdateRequest;
import com.myfcseoul.backend.model.User;
import com.myfcseoul.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api")
public class ProfileController {

    @Autowired
    private UserRepository userRepository;

    /**
     * 프로필 조회 (GET)
     */
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body("로그인이 필요합니다.");
        }
        String userId = principal.getName();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));
        return ResponseEntity.ok(user);
    }

    /**
     * 닉네임 변경 (PUT) – 일주일에 한 번 제한 포함, 중복 검사
     */
    @PutMapping("/profile")
    public ResponseEntity<?> updateNickname(
            @RequestBody ProfileUpdateRequest req,
            Principal principal
    ) {
        if (principal == null) {
            return ResponseEntity.status(401).body("로그인이 필요합니다.");
        }
        String userId = principal.getName();

        // 1) 사용자 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));

        // 2) 1주일 제한 검사
        LocalDateTime last = user.getLastNicknameUpdate();
        if (last != null && last.isAfter(LocalDateTime.now().minusWeeks(1))) {
            return ResponseEntity
                    .badRequest()
                    .body("일주일에 한 번만 닉네임을 변경할 수 있습니다.");
        }



        // 추가) 금지어 검사: "Unknown" 은 사용할 수 없도록
        String newNick = req.getNickname().trim();
        if ("Unknown".equalsIgnoreCase(newNick)) {
            return ResponseEntity
                    .badRequest()
                    .body("‘Unknown’은 사용할 수 없는 닉네임입니다.");
        }

        // 3) 중복 닉네임 검사
        if (userRepository.existsByNicknameAndUserIdNot(newNick, userId)) {
            return ResponseEntity
                    .badRequest()
                    .body("이미 사용 중인 닉네임입니다.");
        }

        // 4) 업데이트 실행 (JPQL)
        LocalDateTime now = LocalDateTime.now();
        userRepository.updateNicknameOnly(userId, newNick, now);

        // 5) 변경된 유저 재조회 및 반환
        User updated = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));
        return ResponseEntity.ok(updated);
    }
}

