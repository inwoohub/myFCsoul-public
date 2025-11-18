// src/components/ChatWindow.js

import React, { useEffect, useState, useRef } from 'react';
import { usePrivateChat } from '../../hooks/usePrivateChat';
import '../../css/ChatWindow.css';

export default function ChatWindow({ userId, friendId}) {
    const [roomId, setRoomId]     = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput]       = useState('');

    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    // 날짜 문자열/숫자/Date 어떤 포맷이 와도 Date 객체로 변환
    const ensureDate = (val) => {
        if (!val) return null;

        // 이미 Date인지 & 유효한지
        if (val instanceof Date && !isNaN(val.getTime())) return val;

        // 숫자 타입 (유닉스 초/밀리초 가정)
        if (typeof val === 'number') {
            const asMs = val < 1e12 ? val * 1000 : val;
            const d = new Date(asMs);
            return isNaN(d.getTime()) ? null : d;
        }

        // 숫자 문자열: 길이로 엄격 판단 (10=초, 13=밀리초만 허용)
        if (typeof val === 'string' && /^\d+$/.test(val)) {
            if (val.length === 10 || val.length === 13) {
                const n = Number(val);
                const asMs = val.length === 10 ? n * 1000 : n;
                const d = new Date(asMs);
                if (!isNaN(d.getTime())) return d;
            }
            // 10/13 자리가 아니면 날짜 숫자로 보지 않음 (YYYYMMDD 같은 케이스 방지)
        }

        // 문자열 일반 포맷들
        if (typeof val === 'string') {
            const s = val.trim();

            // 1) ISO / 공백을 T로 치환, 밀리초/오프셋 포함 케이스 허용
            {
                const isoLike = s.includes('T') ? s : s.replace(' ', 'T');
                const d = new Date(isoLike);
                if (!isNaN(d.getTime())) return d;
            }

            // 2) "YYYY-MM-DD HH:mm(:ss[.fff…])(±hh:mm)?" (로컬 해석 + 오프셋 처리)
            {
                const m = s.match(
                    /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,6}))?)?(?:([+-]\d{2}):?(\d{2}))?$/
                );
                if (m) {
                    const sec = +(m[6] || 0);
                    const ms = m[7] ? Number(m[7].slice(0, 3).padEnd(3, '0')) : 0; // 마이크로초 → ms

                    let d = new Date(+m[1], +m[2]-1, +m[3], +m[4], +m[5], sec, ms);

                    // 타임존 오프셋(+09:00 등)이 포함된 경우 해당 오프셋만큼 보정
                    if (m[8] && m[9]) {
                        const sign = m[8].startsWith('-') ? -1 : 1;
                        const oh = Math.abs(parseInt(m[8], 10));
                        const om = parseInt(m[9], 10);
                        const offsetMinutes = sign * (oh * 60 + om);
                        d = new Date(d.getTime() - offsetMinutes * 60 * 1000);
                    }

                    if (!isNaN(d.getTime())) return d;
                }
            }


            // 3) "M/D H:mm" (프로젝트 메시지 포맷) → 올해로 가정
            {
                const m2 = s.match(/^(\d{1,2})\/(\d{1,2})[ ]+(\d{1,2}):(\d{2})$/);
                if (m2) {
                    const now = new Date();
                    const y = now.getFullYear();
                    const d = new Date(y, +m2[1]-1, +m2[2], +m2[3], +m2[4], 0);
                    if (!isNaN(d.getTime())) return d;
                }
            }
            // 4) "HH:mm" 단독 포맷 -> 오늘 날짜로 보정
            {
                const m3 = s.match(/^(\d{1,2}):(\d{2})$/);
                if (m3) {
                    const now = new Date();
                    const d = new Date(
                        now.getFullYear(),
                        now.getMonth(),
                        now.getDate(),
                        +m3[1],
                        +m3[2],
                        0,
                        0
                    );
                    if (!isNaN(d.getTime())) return d;
                }
            }
        }

        return null; // 최종 실패
    };


    const formatTime = (val) => {
        const d = ensureDate(val);
        if (!d) return '';
        return new Intl.DateTimeFormat('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).format(d);
    };

    function formatDateLabel(dateStr) {
        const date = new Date(dateStr);
        const today = new Date();

        // "오늘"과 "어제" 비교를 위해 날짜만 (연,월,일) 기준으로 변환
        const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        const diffDays = (t - d) / (1000 * 60 * 60 * 24);

        if (diffDays === 0) {
            return "오늘";
        } else if (diffDays === 1) {
            return "어제";
        } else {
            return `${date.getMonth() + 1}월 ${date.getDate()}일`;
        }
    }


    const pad = (n) => (n < 10 ? '0' + n : '' + n);
    const getDateKey = (val) => {
        const d = ensureDate(val);
        if (!d) return '';
        return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
    };


    // 1) friendId 변경 시 방 조회/생성
    useEffect(() => {
        if (!friendId) return;
        setMessages([]);
        setRoomId(null);

        fetch(
            `/api/chat/room?senderId=${userId}&receiverId=${friendId}`,
            { credentials: 'include' }
        )
            .then(res => {
                if (!res.ok) throw new Error('방 조회/생성 실패');
                return res.json();
            })
            .then(data => setRoomId(data.roomId))
            .catch(console.error);
    }, [userId, friendId]);

    useEffect(() => {
        if (!roomId) return;

        fetch(`/api/chat/${roomId}`, { credentials: 'include' })
            .then(res => {
                if (!res.ok) throw new Error('히스토리 로드 실패');
                return res.json();
            })
            .then(history => {
                const normalized = history.map(m => {
                    const raw = pickBestTimeRaw(m);
                    const parsed = ensureDate(raw);
                    return { ...m, sentAt: parsed || raw };
                }).sort((a, b) => {
                    const ta = ensureDate(a.sentAt)?.getTime() ?? 0;
                    const tb = ensureDate(b.sentAt)?.getTime() ?? 0;
                    return ta - tb;
                });
                setMessages(normalized);
            })
            .catch(console.error);
    }, [roomId]);


    // 3) 메시지 전송
    const handleSend = () => {
        if (!input.trim() || !roomId) return;

        sendMessage({ roomId, receiverId: friendId, content: input });

        setMessages(prev => [
            ...prev,
            {
                roomId,
                senderId: userId,
                receiverId: friendId,
                content: input,
                senderNickname: '나',
                sentAt: new Date() // ensureDate가 Date도 처리함
            }
        ]);
        setInput('');
    };

    const { sendMessage } = usePrivateChat({
        userId,
        onMessage: dto => {
            const raw = pickBestTimeRaw(dto);
            const fixed = { ...dto, sentAt: ensureDate(raw) || raw };
            if (fixed.roomId === roomId) {
                setMessages(prev => [...prev, fixed]);
            }
        }
    });

    useEffect(() => {
        if (messages.length) {
            console.log('SAMPLE sentAt raw/parsed:', messages.slice(0,3).map(m => ({
                raw: m.sentAt,
                parsedOk: !!ensureDate(m.sentAt),
                ts: ensureDate(m.sentAt)?.getTime() ?? null
            })));
        }
    }, [messages]);

    const hasDatePart = (v) =>
        typeof v === 'string' && /\d{4}-\d{2}-\d{2}/.test(v);

    const pickBestTimeRaw = (m) => {
        const candidates = [
            m.sentAt, m.timestamp, m.createdAt, m.created_at,
            m.createDate, m.create_date, m.time, m.dateTime, m.datetime
        ].filter(v => v != null);

        if (candidates.length === 0) return null;

        // 1) YYYY-MM-DD 포함 문자열 우선
        const withDate = candidates.find(hasDatePart);
        if (withDate) return withDate;

        // 2) ISO(T 포함)
        const iso = candidates.find(v => typeof v === 'string' && v.includes('T'));
        if (iso) return iso;

        // 3) 숫자 타임스탬프(10/13 자리)
        const num = candidates.find(v => typeof v === 'number' || (/^\d{10}(\d{3})?$/.test(String(v))));
        if (num) return num;

        // 4) 그 외(HH:mm 등) — 최후의 수단
        return candidates[0];
    };


    return (
        <div className="chat-window">
            <div className="chat-messages">
                {messages.map((m, i) => {
                    const currDate = getDateKey(m.sentAt);
                    const prevDate = i > 0 ? getDateKey(messages[i - 1].sentAt) : null;
                    const showDateDivider = currDate !== prevDate; // 날짜 바뀌면 true

                    return (
                        <React.Fragment key={i}>
                            {showDateDivider && (
                                <div className="date-divider">
                                    <span>{formatDateLabel(m.sentAt)}</span>
                                </div>
                            )}
                            <div className={m.senderId === userId ? 'my-message' : 'their-message'}>
                                <div className="message-header">
                                    <span className="sender-name">{m.senderId === userId ? '나' : (m.senderNickname ?? '')}</span>
                                    <span className="message-time">{formatTime(m.sentAt)}</span>
                                </div>
                                <div className="message-content">{m.content}</div>
                            </div>
                        </React.Fragment>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    value={input}
                    placeholder="메시지를 입력하세요..."
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                />
                <button onClick={handleSend}>전송</button>
            </div>
        </div>
    );
}
