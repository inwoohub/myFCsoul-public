import React from "react";
import "../css/ScoreUpdateModal.css";
import ScoreUpdate from "./ScoreUpdate";

function ScoreUpdateModal({ schedule, onClose, onScoreUpdated }) {
    return (
        // 모달 오버레이: 배경 클릭 시 onClose 호출
        <div className="modal-overlay" onClick={onClose}>
            {/* 클릭 이벤트 전파 방지 */}
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <ScoreUpdate schedule={schedule} onClose={onClose} onScoreUpdated={onScoreUpdated} />
            </div>
        </div>
    );
}

export default ScoreUpdateModal;
