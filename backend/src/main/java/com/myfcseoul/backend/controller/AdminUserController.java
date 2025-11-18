package com.myfcseoul.backend.controller;

import com.myfcseoul.backend.dto.UserSummaryDTO;
import com.myfcseoul.backend.model.User;
import com.myfcseoul.backend.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasAuthority('admin')")
public class AdminUserController {

    private final UserService userService;

    public AdminUserController(UserService userService) {
        this.userService = userService;
    }

    /** 사용자 목록 + 검색 + 페이지네이션
     *  예: GET /api/admin/users?page=0&size=20&keyword=kim&sort=createdAt,desc
     */
    @GetMapping
    public ResponseEntity<Page<UserSummaryDTO>> getUsers(
            @RequestParam(value = "keyword", required = false) String keyword,
            @PageableDefault(size = 20) Pageable pageable
    ) {
        Page<User> page = userService.searchUsers(keyword, pageable);

        // 필요 필드만 노출하는 DTO로 변환
        List<UserSummaryDTO> content = page.getContent().stream()
                .map(u -> new UserSummaryDTO(
                        u.getUserId(),
                        u.getNickname(),
                        u.getRole(),              // User 엔티티 필드명에 맞게 조정
                        u.getCreatedAt(),         // 없으면 null 허용
                        u.getLastNicknameUpdate() // 없으면 null 허용
                ))
                .toList();

        return ResponseEntity.ok(new PageImpl<>(content, pageable, page.getTotalElements()));
    }

    /** (선택) 총원만 별도 제공 원할 때 */
    @GetMapping("/count")
    public ResponseEntity<Long> countUsers(
            @RequestParam(value = "keyword", required = false) String keyword
    ) {
        return ResponseEntity.ok(userService.countUsers(keyword));
    }

    @GetMapping("/api/debug/me")
    public Map<String,Object> me(Authentication auth){
        return Map.of("authorities",
                auth.getAuthorities().stream().map(a->a.getAuthority()).toList());
    }
}
