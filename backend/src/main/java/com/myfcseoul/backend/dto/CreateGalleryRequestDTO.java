// src/main/java/com/myfcseoul/backend/dto/CreateGalleryRequestDTO.java
package com.myfcseoul.backend.dto;

import java.time.LocalDateTime;

public class CreateGalleryRequestDTO {
    private String userId;
    private String title;
    private String content;
    private String imageUrl;
    private LocalDateTime createdAt;

    public CreateGalleryRequestDTO() {}

    // Getters & Setters
    public String getUserId() {
        return userId;
    }
    public void setUserId(String userId) {
        this.userId = userId;
    }
    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }
    public String getContent() {
        return content;
    }
    public void setContent(String content) {
        this.content = content;
    }
    public String getImageUrl() {
        return imageUrl;
    }
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
