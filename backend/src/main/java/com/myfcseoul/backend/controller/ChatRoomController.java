package com.myfcseoul.backend.controller;

import com.myfcseoul.backend.model.ChatRoom;
import com.myfcseoul.backend.service.ChatService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ChatRoomController {

    private final ChatService chatService;

    public ChatRoomController(ChatService chatService) {
        this.chatService = chatService;
    }

    /**
     * 두 사용자(senderId, receiverId) 간 방이 있으면 가져오고, 없으면 새로 만듭니다.
     * 요청 예시: GET /api/chat/room?senderId=A&receiverId=B
     */
    @GetMapping("/room")
    public Map<String, Long> getOrCreateRoom(
            @RequestParam("senderId")   String senderId,
            @RequestParam("receiverId") String receiverId
    ) {
        ChatRoom room = chatService.getOrCreateRoom(senderId, receiverId);
        return Collections.singletonMap("roomId", room.getRoomId());
    }
}
