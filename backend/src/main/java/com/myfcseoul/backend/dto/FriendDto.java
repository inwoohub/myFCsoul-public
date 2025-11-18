package com.myfcseoul.backend.dto;

public class FriendDto {
    private String userId;
    private String nickname;

    public FriendDto() {}

    public FriendDto(String userId, String nickname) {
        this.userId   = userId;
        this.nickname = nickname;
    }

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
}
