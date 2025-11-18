package com.myfcseoul.backend.repository;

import com.myfcseoul.backend.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    /**
     * 방(roomId)에 속한 모든 메시지를 보낸 시간 순서대로 조회
     */
    List<ChatMessage> findByRoomRoomIdOrderBySentAtAsc(Long roomId);
}
