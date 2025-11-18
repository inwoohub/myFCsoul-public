package com.myfcseoul.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "User")
public class User {

    // 카카오 고유 ID를 기본 키로 사용 (문자열)
    @Id
    @Column(name = "user_id", nullable = false, unique = true)
    private String userId;

    // 닉네임 컬럼 이름을 IDnickname으로 설정하고 고유 제약 추가
    @Column(name = "IDnickname", nullable = false, unique = true)
    private String nickname;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    // 역할(role) 필드 추가 (예: "user", "admin")
    @Column(name = "role", nullable = false)
    private String role;

    /** 마지막 닉네임 변경 시각 */
    @Column(name = "last_nickname_update")
    private LocalDateTime lastNicknameUpdate;

    /** 마지막 예측 시각 */
    @Column(name = "last_prediction_at")
    private LocalDateTime lastPredictionAt;

    /** 마지막 예측 결과 */
    @Column(name = "last_prediction_result", columnDefinition = "TEXT")
    private String lastPredictionResult;

    // 기본 생성자
    public User() {}

    // 엔티티 저장 전에 생성 시간이 없으면 현재 시간 할당
    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        // 생성 시 role이 지정되지 않았다면 기본 role을 "user"로 설정
        if (this.role == null || this.role.isEmpty()) {
            this.role = "user";
        }
    }

    // Getters and Setters
    public String getUserId() {
        return userId;
    }
    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getNickname() {
        return nickname;
    }
    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getRole() {
        return role;
    }
    public void setRole(String role) {
        this.role = role;
    }

    public LocalDateTime getLastNicknameUpdate() {
        return lastNicknameUpdate;
    }
    public void setLastNicknameUpdate(LocalDateTime lastNicknameUpdate) {
        this.lastNicknameUpdate = lastNicknameUpdate;
    }

    public LocalDateTime getLastPredictionAt() {
        return lastPredictionAt;
    }
    public void setLastPredictionAt(LocalDateTime lastPredictionAt) {
        this.lastPredictionAt = lastPredictionAt;
    }

    public String getLastPredictionResult() {
        return lastPredictionResult;
    }
    public void setLastPredictionResult(String lastPredictionResult) {
        this.lastPredictionResult = lastPredictionResult;
    }
}
