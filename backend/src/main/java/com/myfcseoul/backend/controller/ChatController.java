package com.myfcseoul.backend.controller;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.myfcseoul.backend.dto.ChatMessageDTO;
import com.myfcseoul.backend.model.ChatMessage;
import com.myfcseoul.backend.model.ChatRoom;
import com.myfcseoul.backend.service.ChatService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@RestController
public class ChatController {
    private static final Logger log = LoggerFactory.getLogger(ChatController.class);

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;
    private final DateTimeFormatter F = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSS");

    public ChatController(ChatService chatService,
                          SimpMessagingTemplate messagingTemplate) {
        this.chatService = chatService;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/chat/private")
    public void handlePrivateMessage(@Payload ChatMessageDTO dto) {
        log.info("[WS-IN] senderId={}, receiverId={}, contentLen={}",
                dto.getSenderId(), dto.getReceiverId(),
                dto.getContent() == null ? 0 : dto.getContent().length());

        if (dto.getSenderId() == null || dto.getReceiverId() == null) {
            log.warn("[WS-DROP] invalid payload: senderId or receiverId is null");
            return;
        }
        if (dto.getContent() == null || dto.getContent().isBlank()) {
            log.warn("[WS-DROP] empty content");
            return;
        }

        try {
            ChatRoom room = chatService.getOrCreateRoom(dto.getSenderId(), dto.getReceiverId());
            log.info("[ROOM] roomId={}, sender={}, receiver={}",
                    room.getRoomId(), dto.getSenderId(), dto.getReceiverId());

            ChatMessage saved = chatService.saveMessage(
                    room.getRoomId(),
                    dto.getSenderId(),
                    dto.getContent()
            );


            log.info("[DB-SAVE-OK] roomId={}, senderId={}, at={}",
                    room.getRoomId(), dto.getSenderId(), saved.getSentAt());

            dto.setRoomId(room.getRoomId());
            dto.setSenderNickname(saved.getSender().getNickname());
            dto.setSentAt(saved.getSentAt().format(F));

            messagingTemplate.convertAndSendToUser(
                    dto.getReceiverId(),
                    "/queue/messages",
                    dto
            );
            log.info("[WS-OUT] toUser={}, dest=/queue/messages", dto.getReceiverId());

        } catch (Exception e) {
            log.error("[DB-SAVE-FAIL] senderId={}, receiverId={}, err={}",
                    dto.getSenderId(), dto.getReceiverId(), e.toString(), e);
        }
    }

    /**
     * REST API: 과거 메시지 히스토리 조회
     * GET /api/chat/{roomId}
     */
    @GetMapping("/api/chat/{roomId}")
    public List<ChatMessageDTO> getChatHistory(@PathVariable Long roomId) {
        return chatService.getHistory(roomId).stream().map(m -> {
            ChatMessageDTO dto = new ChatMessageDTO();
            dto.setRoomId(roomId);
            dto.setSenderId(m.getSender().getUserId());
            dto.setReceiverId(null); // 불필요하면 무시
            dto.setContent(m.getContent());
            dto.setSenderNickname(m.getSender().getNickname());
            dto.setSentAt(m.getSentAt().format(F));
            return dto;
        }).collect(Collectors.toList());
    }
}
