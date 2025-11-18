// src/components/messenger/MessengerModal.js

import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import '../../css/Messenger.css';

/**
 * MessengerModal.js
 * Props:
 *  - isOpen: boolean, 모달 열림 여부
 *  - onClose: () => void, 모달 닫기 콜백
 *  - user: object, 현재 로그인된 사용자 정보 ({ userId, nickname, ... })
 */
export default function MessengerModal({ isOpen, onClose, user }) {
    const [activeChat, setActiveChat] = useState(null);
    const [animating, setAnimating] = useState(false);
    const modalRef = useRef();

    // 활성 채팅방이 설정되면 애니메이션 트리거
    useEffect(() => {
        if (activeChat) {
            requestAnimationFrame(() => setAnimating(true));
        } else {
            setAnimating(false);
        }
    }, [activeChat]);

    // ESC 키로 닫기
    useEffect(() => {
        function handleKey(e) {
            if (e.key === 'Escape') onClose();
        }
        if (isOpen) window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [isOpen, onClose]);

    // 배경 클릭 시 닫기
    function handleBackdropClick(e) {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            onClose();
        }
    }

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div
            className="messenger-modal-overlay"
            onMouseDown={handleBackdropClick}
        >
            <div ref={modalRef} className="messenger-modal-content">
                <button className="modalCloseBtn" onClick={onClose}>X</button>

                {/* 사이드바: activeChat 없으면 축소판, 있으면 기본 */}
                <aside
                    className={
                        activeChat
                            ? 'messenger-sidebar'
                            : 'messenger-sidebar-collapsed'
                    }
                >
                    <ChatList
                        activeChat={activeChat}
                        onSelectChat={setActiveChat}
                        user={user}
                    />
                </aside>

                {/* 채팅창 애니메이션: book-open 느낌 */}
                <section className={`messenger-main ${animating ? 'open' : ''}`}>
                    {activeChat ? (
                        <ChatWindow
                            userId={user.userId}     // 로그인된 사용자 ID
                            friendId={activeChat}
                            // 선택된 친구의 ID
                        />
                    ) : (
                        <div className="no-chat-selected">친구를 선택하세요.</div>
                    )}
                </section>
            </div>
        </div>,
        document.body
    );
}
