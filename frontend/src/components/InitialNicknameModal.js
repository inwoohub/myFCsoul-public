// src/components/InitialNicknameModal.js
import React, { useState } from "react";
import "../css/InitialNicknameModal.css";

export default function InitialNicknameModal({ onSave }) {
    const [nickname, setNickname] = useState("");
    const [error, setError] = useState("");

    const validRegex = /^[A-Za-zㄱ-ㅎㅏ-ㅣ가-힣]*$/;
    const calcLen   = str => {
        const enCount  = (str.match(/[A-Za-z]/g) || []).length;
        const korCount = (str.match(/[ㄱ-ㅎㅏ-ㅣ가-힣]/g) || []).length;
        return enCount * 0.5 + korCount;
    };

    const handleChange = e => {
        const v = e.target.value;
        if (!validRegex.test(v)) {
            setError("한글·영문만 입력 가능합니다.");
            return;
        }
        if (calcLen(v) > 6) {
            setError("최대 6글자(영문 0.5, 한글 1)까지만 입력 가능합니다.");
            return;
        }
        setError("");
        setNickname(v);
    };

    // 이 컴포넌트에서 호출할 함수는 onSave(nickname) 뿐
    const handleSave = () => {
        if (!nickname.trim()) {
            setError("닉네임을 입력해주세요.");
            return;
        }
        onSave(nickname);
    };

    return (
        <div className="InitialNicknameModal-overlay">
            <div className="InitialNicknameModal-content">
                <h2>초기 닉네임을 설정해주세요.</h2>
                <input
                    type="text"
                    value={nickname}
                    onChange={handleChange}
                    placeholder="닉네임 입력"
                />
                {error && <p className="error-text">{error}</p>}
                <div className="InitialNicknameModal-actions">
                    <button onClick={handleSave} disabled={!!error}>
                        저장
                    </button>
                </div>
            </div>
        </div>
    );
}
