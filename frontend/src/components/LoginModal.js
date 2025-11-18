// LoginModal.js
import React from "react";
import "../css/LoginModal.css";
import Login from "../pages/Login"; // Login.js를 모달 내부에 표시

function LoginModal({ onClose }) {
    return (
        // 모달 오버레이: 배경 클릭 시 onClose를 호출할 수도 있음
        <div className="modal-overlay" onClick={onClose}>
            {/* 클릭 이벤트가 오버레이에 전파되지 않도록 */}
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>X</button>
                {/* Login 컴포넌트 포함 */}
                <Login />
            </div>
        </div>
    );
}

export default LoginModal;
