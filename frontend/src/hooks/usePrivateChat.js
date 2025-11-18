// src/hooks/usePrivateChat.js
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useEffect, useRef, useState } from 'react';

export function usePrivateChat({ userId, onMessage }) {
    const clientRef = useRef(null);

    useEffect(() => {
        const stompClient = new Client({
            webSocketFactory: () => new SockJS('/ws-chat'),
            debug: () => {},           // 디버그 로그 끄기
            reconnectDelay: 5000,
            connectHeaders: { },
            onConnect: () => {
                stompClient.subscribe(
                    '/user/queue/messages',
                    frame => {
                      const dto = JSON.parse(frame.body);
                      onMessage(dto);
                    }
                  );
            },
            onStompError: frame => {
                console.error('STOMP error', frame);
            },
        });

        stompClient.activate();
        clientRef.current = stompClient;

        return () => {
            stompClient.deactivate();
        };
    }, [userId, onMessage]);

    // 메시지 보내기
    const sendMessage = ({ roomId, receiverId, content }) => {
        if (!clientRef.current || !clientRef.current.connected) return;
        const dto = { roomId, senderId: userId, receiverId, content };
        clientRef.current.publish({
            destination: '/app/chat/private',
            body: JSON.stringify(dto),
        });
    };

    return { sendMessage };
}
