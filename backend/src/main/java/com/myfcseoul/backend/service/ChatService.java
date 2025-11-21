package com.myfcseoul.backend.service;

import com.myfcseoul.backend.model.ChatMessage;
import com.myfcseoul.backend.model.ChatRoom;
import com.myfcseoul.backend.model.User;
import com.myfcseoul.backend.repository.ChatMessageRepository;
import com.myfcseoul.backend.repository.ChatRoomRepository;
import com.myfcseoul.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ChatService {

    private final ChatRoomRepository roomRepo;
    private final ChatMessageRepository msgRepo;
    private final UserRepository userRepo;  // User 엔티티 조회용

    public ChatService(ChatRoomRepository roomRepo,
                       ChatMessageRepository msgRepo,
                       UserRepository userRepo) {
        this.roomRepo = roomRepo;
        this.msgRepo = msgRepo;
        this.userRepo = userRepo;
    }

    @Transactional
    public ChatRoom getOrCreateRoom(String senderId, String receiverId) {
        return roomRepo.findByUsers(senderId, receiverId)
                .orElseGet(() -> {
                    ChatRoom room = new ChatRoom();
                    room.setUser1(userRepo.findById(senderId)
                            .orElseThrow(() -> new IllegalArgumentException("사용자 없음: " + senderId)));
                    room.setUser2(userRepo.findById(receiverId)
                            .orElseThrow(() -> new IllegalArgumentException("사용자 없음: " + receiverId)));
                    return roomRepo.save(room);
                });
    }

    @Transactional
    public ChatMessage saveMessage(Long roomId, String senderId, String content) {
        ChatMessage msg = new ChatMessage();
        msg.setRoom(roomRepo.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("방 없음: " + roomId)));
        msg.setSender(userRepo.findById(senderId)
                .orElseThrow(() -> new IllegalArgumentException("사용자 없음: " + senderId)));
        msg.setContent(content);
        return msgRepo.saveAndFlush(msg); // ← 원하면 이렇게
    }


    @Transactional(readOnly = true)
    public List<ChatMessage> getHistory(Long roomId) {
        return msgRepo.findByRoomRoomIdOrderBySentAtAsc(roomId);
    }
}
