import React from "react";
import "../css/ScheduleRegistrationModal.css";
import ScheduleRegistration from "./ScheduleRegistration";

function ScheduleRegistrationModal({ onClose }) {
    return (
        // 모달 오버레이: 배경 클릭 시 onClose를 호출할 수도 있음
        <div className="modal-overlay" onClick={onClose}>
            {/* 클릭 이벤트가 오버레이에 전파되지 않도록 */}
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>X</button>
                {/* Login 컴포넌트 포함 */}
                <ScheduleRegistration />
            </div>
        </div>
    );
}

export default ScheduleRegistrationModal;
