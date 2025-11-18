import React from "react";
import "../css/GameDetailModal.css"; // 별도의 CSS 파일에서 스타일 관리

function GameDetailModal({ schedules, onClose }) {
    // 날짜와 시간을 원하는 형식으로 포맷팅하는 헬퍼 함수
    const formatScheduleDateTime = (dateString, timeString) => {
        // 날짜는 "YYYY-MM-DD", 시간은 "HH:mm" 형식이라고 가정합니다.
        const [year, month, day] = dateString.split("-");
        const [hour, minute] = timeString.split(":");
        const formattedDate = `${year}년 ${parseInt(month, 10)}월 ${parseInt(day, 10)}일`;
        // 분이 "00" 인 경우 분 부분 생략
        return minute === "00"
            ? `${formattedDate} ${hour}시`
            : `${formattedDate} ${hour}시${minute}분`;
    };

    // 경기 대진 형식을 항상 "서울"이 앞에 오도록 지정하는 헬퍼 함수
    const formatMatchup = (homeTeam, awayTeam) => {
        if (homeTeam === "서울") {
            return `서울 vs ${awayTeam}`;
        } else if (awayTeam === "서울") {
            return `서울 vs ${homeTeam}`;
        }
        return `${homeTeam} vs ${awayTeam}`;
    };

    return (
        <div className="gameDetailModalOverlay" onClick={onClose}>
            <div className="gameDetailModalContent" onClick={(e) => e.stopPropagation()}>
                <button className="modalCloseBtn" onClick={onClose}>X</button>
                <span>경기 정보</span>
                {schedules.map((sch) => (
                    <div key={sch.scheduleId} className="gameDetailItem">
                        <p>
                            <strong>일정:</strong>{" "}
                            {formatScheduleDateTime(sch.matchDate, sch.matchTime)}
                        </p>
                        <p>
                            <strong>대진:</strong> {formatMatchup(sch.homeTeam, sch.awayTeam)}
                        </p>
                        {sch.location && (
                            <p>
                                <strong>장소:</strong> {sch.location}
                            </p>
                        )}
                        {/* 필요하다면 추가 정보 표시 */}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default GameDetailModal;
