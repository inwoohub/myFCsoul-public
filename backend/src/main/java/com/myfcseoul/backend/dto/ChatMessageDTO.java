package com.myfcseoul.backend.dto;

public class ChatMessageDTO {
    private Long roomId;
    private String senderId;
    private String receiverId;
    private String content;

    // 추가된 필드
    private String senderNickname;
    private String sentAt;

    public ChatMessageDTO() {}

    public Long getRoomId() {
        return roomId;
    }
    public void setRoomId(Long roomId) {
        this.roomId = roomId;
    }

    public String getSenderId() {
        return senderId;
    }
    public void setSenderId(String senderId) {
        this.senderId = senderId;
    }

    public String getReceiverId() {
        return receiverId;
    }
    public void setReceiverId(String receiverId) {
        this.receiverId = receiverId;
    }

    public String getContent() {
        return content;
    }
    public void setContent(String content) {
        this.content = content;
    }

    // 추가된 getter/setter
    public String getSenderNickname() {
        return senderNickname;
    }
    public void setSenderNickname(String senderNickname) {
        this.senderNickname = senderNickname;
    }

    public String getSentAt() {
        return sentAt;
    }
    public void setSentAt(String sentAt) {
        this.sentAt = sentAt;
    }
}
