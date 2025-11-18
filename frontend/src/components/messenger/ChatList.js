// src/components/messenger/ChatList.js

import React, { useEffect, useState } from 'react';
import '../../css/Messenger.css';

/**
 * ChatList.js
 * Props:
 *  - activeChat: string | null, 현재 선택된 채팅방 ID
 *  - onSelectChat: (chatId: string) => void, 채팅방 선택 콜백
 *  - user: object, 현재 로그인된 사용자 정보 ({ userId, nickname, ... })
 */
export default function ChatList({ activeChat, onSelectChat, user }) {
    const [rooms, setRooms] = useState([]);            // 친구 목록 ({ userId, nickname }[])
    const [incoming, setIncoming] = useState([]);     // 받은 요청 ({ userId, nickname }[])
    const [outgoing, setOutgoing] = useState([]);     // 보낸 요청 ({ userId, nickname }[])
    const [newNickname, setNewNickname] = useState('');
    const [error, setError] = useState(null);
    const [selectedTab, setSelectedTab] = useState('friends'); // 탭 상태
    const [menuOpenId, setMenuOpenId] = useState(null);


    // 친구 목록 불러오기 (DTO: { userId, nickname })
    const fetchRooms = () => {
        fetch('/api/friends', { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                setRooms(Array.isArray(data) ? data : []);
                setError(null);
            })
            .catch(() => setError('친구 목록 로드 실패'));
    };

    // 받은 요청 목록 불러오기
    const fetchIncoming = () => {
        fetch('/api/friends/requests', { credentials: 'include' })
            .then(res => res.json())
            .then(data => setIncoming(Array.isArray(data) ? data : []))
            .catch(err => console.error('Incoming fetch error:', err));
    };

    // 보낸 요청 목록 불러오기
    const fetchOutgoing = () => {
        fetch('/api/friends/requests/sent', { credentials: 'include' })
            .then(res => res.json())
            .then(data => setOutgoing(Array.isArray(data) ? data : []))
            .catch(err => console.error('Outgoing fetch error:', err));
    };

    useEffect(() => {
        fetchRooms();
        fetchIncoming();
        fetchOutgoing();
    }, []);

    // 친구 추가 요청 (닉네임 기반)
    const handleAddFriend = () => {
        if (!newNickname.trim()) return;
        fetch('/api/friends', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ nickname: newNickname.trim() })
        })
            .then(res => {
                if (!res.ok) throw new Error('친구 요청 실패');
                setNewNickname('');
                fetchRooms();
                fetchIncoming();
                fetchOutgoing();
            })
            .catch(err => setError(err.message));
    };

    // 받은 요청 수락
    const handleAccept = userObj => {
        fetch(`/api/friends/${userObj.userId}/accept`, {
            method: 'PUT', credentials: 'include'
        })
            .then(res => {
                if (!res.ok) throw new Error('수락 실패');
                fetchRooms();
                fetchIncoming();
                fetchOutgoing();
            })
            .catch(err => setError(err.message));
    };

    // 받은 요청 거절
    const handleReject = userObj => {
        fetch(`/api/friends/${userObj.userId}/reject`, {
            method: 'PUT', credentials: 'include'
        })
            .then(res => {
                if (!res.ok) throw new Error('거절 실패');
                fetchIncoming();
                fetchOutgoing();
            })
            .catch(err => setError(err.message));
    };

    // 보낸 요청 취소
    const handleCancel = userObj => {
        fetch(`/api/friends/${userObj.userId}`, {
            method: 'DELETE', credentials: 'include'
        })
            .then(res => {
                if (!res.ok) throw new Error('취소 실패');
                fetchRooms();
                fetchIncoming();
                fetchOutgoing();
            })
            .catch(err => setError(err.message));
    };

    // 1) 삭제 핸들러 수정
    const handleRemoveFriend = (friendId) => {
        fetch(`/api/friends/${friendId}`, {
            method: 'DELETE',
            credentials: 'include'
        })
            .then(res => {
                if (res.status === 204) {
                    // 삭제 성공: 친구 목록 다시 불러오기
                    fetchRooms();
                } else {
                    throw new Error('삭제 실패');
                }
            })
            .catch(err => {
                console.error('Remove friend error:', err);
            });
    };

    return (
        <div className="chat-list-tabs">
            {/* 1. 탭 헤더 */}
            <nav className="tab-header">
                <button
                    className={selectedTab === 'friends' ? 'active' : ''}
                    onClick={() => setSelectedTab('friends')}
                >
                    친구목록
                </button>
                <button
                    className={selectedTab === 'outgoing' ? 'active' : ''}
                    onClick={() => setSelectedTab('outgoing')}
                >
                    대기중
                </button>
                <button
                    className={selectedTab === 'incoming' ? 'active' : ''}
                    onClick={() => setSelectedTab('incoming')}
                >
                    받은요청
                </button>
                <button
                    className={selectedTab === 'add' ? 'active' : ''}
                    onClick={() => setSelectedTab('add')}
                >
                    친구추가
                </button>
            </nav>

            {/* 2. 탭 콘텐츠 */}
            <div className="tab-content">
                {selectedTab === 'friends' && (
                    <ul className="chat-list">
                        {rooms.map(u => (
                            <li
                                key={u.userId}
                                className={`chat-list-item ${menuOpenId === u.userId ? 'open' : ''}`}
                                onClick={() => setMenuOpenId(menuOpenId === u.userId ? null : u.userId)}
                            >
                                <span className="chat-list-name">{u.nickname}</span>

                                {/* 메뉴 열려 있을 때만 렌더링 */}
                                {menuOpenId === u.userId && (
                                    <div className="chat-list-dropdown">
                                        <ul>
                                            <li
                                                className="chat-list-dropdown-item"
                                                onClick={() => {
                                                    onSelectChat(u.userId);
                                                    setMenuOpenId(null); // 메뉴 닫기
                                                }}
                                            >
                                                1:1 채팅하기
                                            </li>
                                            <li onClick={() => handleRemoveFriend(u.userId)}>친구 삭제하기</li>
                                        </ul>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}

                {selectedTab === 'outgoing' && (
                    <ul>
                        {outgoing.length > 0
                            ? outgoing.map(u => (
                                <li key={u.userId}>
                                    {u.nickname}
                                    <button className="chat-list-button-false" onClick={() => handleCancel(u)}>취소</button>
                                </li>
                            ))
                            : <p>—</p>
                        }
                    </ul>
                )}

                {selectedTab === 'incoming' && (
                    <ul>
                        {incoming.length > 0
                            ? incoming.map(u => (
                                <li key={u.userId}>
                                    {u.nickname}
                                    <button className="chat-list-button-true" onClick={() => handleAccept(u)}>수락</button>
                                    <button className="chat-list-button-false" onClick={() => handleReject(u)}>거절</button>
                                </li>
                            ))
                            : <p>—</p>
                        }
                    </ul>
                )}

                {selectedTab === 'add' && (
                    <div className="add-friend-section-div">
                        <input
                            className="add-friend-section"
                            type="text"
                            placeholder="친구 닉네임 입력"
                            value={newNickname}
                            onChange={e => setNewNickname(e.target.value)}
                        />
                        <div>
                            <button onClick={handleAddFriend}>추가</button>
                            {error && <div className="error-text">{error}</div>}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
