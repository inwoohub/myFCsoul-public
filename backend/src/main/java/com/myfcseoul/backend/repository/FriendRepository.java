package com.myfcseoul.backend.repository;

import com.myfcseoul.backend.model.Friend;
import com.myfcseoul.backend.model.FriendId;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FriendRepository
        extends JpaRepository<Friend, FriendId> {

    // 내가 보낸 요청 중 수락된 친구 목록
    List<Friend> findByUserIdAndStatus(String userId, String status);

    // 나에게 온 요청 중 수락된 친구 목록
    List<Friend> findByFriendIdAndStatus(String friendId, String status);

    // 이미 보낸 요청이 있는지 체크
    boolean existsByUserIdAndFriendId(String userId, String friendId);

    // PENDING 요청 조회
    Friend findByUserIdAndFriendIdAndStatus(String userId, String friendId, String status);
}
