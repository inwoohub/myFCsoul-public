package com.myfcseoul.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@IdClass(FriendId.class)
@Table(name = "Friend")
public class Friend {

    @Id
    @Column(name = "user_id", nullable = false)
    private String userId;

    @Id
    @Column(name = "friend_id", nullable = false)
    private String friendId;

    /** 요청 상태: PENDING, ACCEPTED, REJECTED 등 */
    @Column(nullable = false)
    private String status;

    /** 친구 요청 시각 */
    @Column(name = "requested_at", nullable = false)
    private LocalDateTime requestedAt;

    /** 요청에 대한 응답 시각 (수락/거절 시) */
    @Column(name = "responded_at")
    private LocalDateTime respondedAt;

    /** 마지막 메시지 시각 (채팅 연동 시 사용) */
    @Column(name = "last_message_at")
    private LocalDateTime lastMessageAt;

    public Friend() {}

    // 생성 시 기본값 세팅을 원하면 @PrePersist 메서드 추가 가능
    @PrePersist
    private void prePersist() {
        if (requestedAt == null) {
            requestedAt = LocalDateTime.now();
        }
        if (status == null) {
            status = "PENDING";
        }
    }

    // --- getters & setters ---
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getFriendId() { return friendId; }
    public void setFriendId(String friendId) { this.friendId = friendId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getRequestedAt() { return requestedAt; }
    public void setRequestedAt(LocalDateTime requestedAt) { this.requestedAt = requestedAt; }

    public LocalDateTime getRespondedAt() { return respondedAt; }
    public void setRespondedAt(LocalDateTime respondedAt) { this.respondedAt = respondedAt; }

    public LocalDateTime getLastMessageAt() { return lastMessageAt; }
    public void setLastMessageAt(LocalDateTime lastMessageAt) { this.lastMessageAt = lastMessageAt; }
}
