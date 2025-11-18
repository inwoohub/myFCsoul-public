package com.myfcseoul.backend.model;

import java.io.Serializable;
import java.util.Objects;

/**
 * 친구 관계의 복합 키 (user_id + friend_id)
 */
public class FriendId implements Serializable {
    private String userId;
    private String friendId;

    public FriendId() {}

    public FriendId(String userId, String friendId) {
        this.userId = userId;
        this.friendId = friendId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof FriendId)) return false;
        FriendId that = (FriendId) o;
        return Objects.equals(userId, that.userId) &&
                Objects.equals(friendId, that.friendId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, friendId);
    }

}
