
import React, { useState, useEffect } from "react";
import "../css/Mypage.css";

function Mypage({ user, onClose }) {
    const [nickname, setNickname] = useState("");

    const handleLogout = () => {
        fetch("/logout", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }).finally(() => {
            window.location.href = "/";
        });
    };

    return (
        <div className="profile-modal-overlay" onClick={() => onClose()}>
            <div
                className="profile-modal-content"
                onClick={(e) => e.stopPropagation()}
            >
                <button className="modal-close" onClick={() => onClose()}>X</button>
                <h2>마이페이지</h2>



                <div className="logout-section">
                    <button className="logout-button" onClick={handleLogout}>
                        로그아웃
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Mypage;
