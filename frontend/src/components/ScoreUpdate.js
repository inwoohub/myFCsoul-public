import React, { useState } from "react";
import "../css/ScoreUpdate.css";

function ScoreUpdate({ schedule, onClose, onScoreUpdated }) {
    // ScoreUpdate 컴포넌트 초기값 설정
    const [scoreHome, setScoreHome] = useState(
        schedule.scoreHome !== null ? schedule.scoreHome : ""
    );
    const [scoreAway, setScoreAway] = useState(
        schedule.scoreAway !== null ? schedule.scoreAway : ""
    );
    const [result, setResult] = useState(schedule.result || "");

    const handleSubmit = () => {
        // 입력값 검증
        if (scoreHome === "" || scoreAway === "" || result === "") {
            alert("모든 값을 입력해 주세요.");
            return;
        }

        const payload = {
            scheduleId: schedule.scheduleId,
            scoreHome: parseInt(scoreHome, 10),
            scoreAway: parseInt(scoreAway, 10),
            result: result // '승', '무', '패' 중 하나
        };

        fetch("/api/scheduleresult", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Result update failed.");
                }
                return response.json();
            })
            .then((data) => {
                alert("Match result updated successfully!");
                if (onScoreUpdated) {
                    onScoreUpdated(payload);
                }
                onClose();
                window.location.reload();
            })
            .catch((error) => {
                console.error("Score update error:", error);
                alert("Failed to update result.");
            });
    };

    const handleDelete = () => {
        // 삭제 전 확인
        if (!window.confirm("다 날라가는데 진짜 삭제해?")) {
            return;
        }

        const payload = {
            scheduleId: schedule.scheduleId
        };

        fetch("/api/scheduleresult", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Delete failed.");
                }
                return response.json();
            })
            .then((data) => {
                alert("Match result deleted successfully!");
                if (onScoreUpdated) {
                    // 삭제 후 전용 콜백으로 처리할 수 있습니다.
                    onScoreUpdated({ deleted: true, scheduleId: schedule.scheduleId });
                }
                onClose();
                window.location.reload();
            })
            .catch((error) => {
                console.error("Score delete error:", error);
                alert("Failed to delete result.");
            });
    };

    return (
        <div className="ScoreUpdate_page">
            <div className="ScoreUpdate_modal_content">
                <button className="ScoreUpdate_close_btn" onClick={onClose}>X</button>
                <div className="ScoreUpdate_match_info">
                    <p>
                        {schedule.homeTeam} vs {schedule.awayTeam}
                    </p>
                    <p>
                        {schedule.matchDate} {schedule.matchTime}
                    </p>
                </div>
                <div className="ScoreUpdate_input_group">
                    <label>{schedule.homeTeam} Score:</label>
                    <input
                        type="number"
                        value={scoreHome}
                        onChange={(e) => setScoreHome(e.target.value)}
                    />
                </div>
                <div className="ScoreUpdate_input_group">
                    <label>{schedule.awayTeam} Score:</label>
                    <input
                        type="number"
                        value={scoreAway}
                        onChange={(e) => setScoreAway(e.target.value)}
                    />
                </div>
                <div className="ScoreUpdate_input_group">
                    <label>Result:</label>
                    <select value={result} onChange={(e) => setResult(e.target.value)}>
                        <option value="">결과 선택</option>
                        <option value="승">승</option>
                        <option value="무">무</option>
                        <option value="패">패</option>
                    </select>
                </div>
                <button className="ScoreUpdate_submit_btn" onClick={handleSubmit}>
                    등록
                </button>
                {/* 삭제 버튼 추가 */}
                <button
                    className="ScoreUpdate_delete_btn"
                    onClick={handleDelete}
                >
                    결과 삭제
                </button>
            </div>
        </div>
    );
}

export default ScoreUpdate;
