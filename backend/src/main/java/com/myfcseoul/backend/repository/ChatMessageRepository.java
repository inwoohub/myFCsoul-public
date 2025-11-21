package com.myfcseoul.backend.repository;

import com.myfcseoul.backend.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    List<ChatMessage> findByRoomRoomIdOrderBySentAtAsc(Long roomId);
}
