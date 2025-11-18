package com.myfcseoul.backend.dto;

import java.time.LocalDateTime;

public class UserSummaryDTO {
    private String userId;
    private String nickname;
    private String role;
    private LocalDateTime createdAt;
    private LocalDateTime lastNicknameUpdate;

    public UserSummaryDTO() {}

    public UserSummaryDTO(String userId, String nickname, String role,
                          LocalDateTime createdAt, LocalDateTime lastNicknameUpdate) {
        this.userId = userId;
        this.nickname = nickname;
        this.role = role;
        this.createdAt = createdAt;
        this.lastNicknameUpdate = lastNicknameUpdate;
    }

    public String getUserId() { return userId; }
    public String getNickname() { return nickname; }
    public String getRole() { return role; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getLastNicknameUpdate() { return lastNicknameUpdate; }

    public void setUserId(String userId) { this.userId = userId; }
    public void setNickname(String nickname) { this.nickname = nickname; }
    public void setRole(String role) { this.role = role; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setLastNicknameUpdate(LocalDateTime lastNicknameUpdate) { this.lastNicknameUpdate = lastNicknameUpdate; }
}
