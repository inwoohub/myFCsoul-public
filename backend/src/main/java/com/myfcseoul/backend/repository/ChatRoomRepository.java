package com.myfcseoul.backend.repository;

import com.myfcseoul.backend.model.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    /**
     * 두 유저(user1, user2)로 이미 생성된 방이 있는지 조회.
     * (user1–user2 또는 user2–user1 순서 모두 지원)
     */
    @Query("""
        SELECT r 
        FROM ChatRoom r
        WHERE (r.user1.userId = :u1 AND r.user2.userId = :u2)
           OR (r.user1.userId = :u2 AND r.user2.userId = :u1)
    """)
    Optional<ChatRoom> findByUsers(
            @Param("u1") String user1Id,
            @Param("u2") String user2Id
    );
}
