import React, { useState, useEffect } from "react";
import "../css/ScheduleRegistration.css";

function ScheduleRegistration({ onClose }) {
    const [matchDate, setMatchDate] = useState("");
    const [matchTime, setMatchTime] = useState("");
    const [venue, setVenue] = useState("");
    const [opponent, setOpponent] = useState("");
    const [schedules, setSchedules] = useState([]);  // 일정 목록 저장

    const venueOptions = [
        "대전월드컵경기장",
        "김천종합운동장",
        "광주월드컵경기장",
        "서울월드컵경기장",
        "포항스틸야드",
        "전주월드컵경기장",
        "울산문수월드컵경기장",
        "강릉종합운동장",
        "춘천송암스포츠타운",
        "안양종합운동장",
        "대구iM뱅크PARK",
        "제주월드컵경기장",
        "수원종합운동장"
    ];

    const opponentOptions = [
        "대전",
        "김천",
        "광주",
        "포항",
        "전북",
        "울산",
        "강원",
        "안양",
        "대구",
        "제주",
        "수원fc"
    ];

    // 30분 단위의 시간을 생성하는 함수
    const generateTimeOptions = () => {
        const times = [];
        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const formattedHour = hour < 10 ? `0${hour}` : hour;
                const formattedMinute = minute < 10 ? `0${minute}` : minute;
                times.push(`${formattedHour}:${formattedMinute}`);
            }
        }
        return times;
    };

    // 날짜 포맷 함수: "YYYY-MM-DD" -> "M월D일"
    const formatDate = (dateString) => {
        const parts = dateString.split("-");
        if (parts.length < 3) return dateString;
        const month = parseInt(parts[1], 10);
        const day = parseInt(parts[2], 10);
        return `${month}월${day}일`;
    };

    // 시간 포맷 함수: "HH:mm:ss" 또는 "HH:mm" -> "HH:mm"
    const formatTime = (timeString) => {
        const parts = timeString.split(":");
        if (parts.length < 2) return timeString;
        return `${parts[0]}:${parts[1]}`;
    };

    // 일정 등록 폼 제출 핸들러
    const handleSubmit = (e) => {
        e.preventDefault();

        let homeTeam, awayTeam;
        if (venue === "서울월드컵경기장") {
            homeTeam = "서울";
            awayTeam = opponent;
        } else {
            homeTeam = opponent;
            awayTeam = "서울";
        }

        const schedule = {
            matchDate: matchDate,
            matchTime: matchTime,
            homeTeam: homeTeam,
            awayTeam: awayTeam,
            location: venue,
        };

        fetch("/api/schedule", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(schedule),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("일정 등록에 실패했습니다.");
                }
                return response.json();
            })
            .then((data) => {
                console.log("일정 등록 성공:", data);
                fetchSchedules();
                if (onClose) {
                    onClose();
                }
            })
            .catch((error) => console.error("일정 등록 에러:", error));
    };

    // 일정 목록을 백엔드에서 가져오는 함수
    const fetchSchedules = () => {
        fetch("/api/schedule", {
            credentials: "include",
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("일정 목록을 불러오지 못했습니다.");
                }
                return response.json();
            })
            .then((data) => {
                setSchedules(data);
            })
            .catch((error) => console.error("일정 목록 불러오기 에러:", error));
    };

    // DELETE 요청을 보내 일정 삭제하는 함수
    const handleDelete = (scheduleId) => {
        fetch(`/api/schedule/${scheduleId}`, {
            method: "DELETE",
            credentials: "include",
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("일정 삭제에 실패했습니다.");
                }
                // 삭제 후 목록을 갱신합니다.
                fetchSchedules();
            })
            .catch((error) => console.error("일정 삭제 에러:", error));
    };

    // 컴포넌트 마운트 시 일정 목록 불러오기
    useEffect(() => {
        fetchSchedules();
    }, []);

    return (
        <div className="ScheduleRegistration_page">
            <form onSubmit={handleSubmit}>
                <div className="formField">
                    <label htmlFor="matchDate">경기 날짜:</label>
                    <input
                        type="date"
                        id="matchDate"
                        value={matchDate}
                        onChange={(e) => setMatchDate(e.target.value)}
                        required
                    />
                </div>
                <div className="formField">
                    <label htmlFor="matchTime">경기 시간:</label>
                    <select
                        id="matchTime"
                        value={matchTime}
                        onChange={(e) => setMatchTime(e.target.value)}
                        required
                    >
                        <option value="">선택하세요</option>
                        {generateTimeOptions().map((time) => (
                            <option key={time} value={time}>{time}</option>
                        ))}
                    </select>
                </div>
                <div className="formField">
                    <label htmlFor="venue">경기장:</label>
                    <select
                        id="venue"
                        value={venue}
                        onChange={(e) => setVenue(e.target.value)}
                        required
                    >
                        <option value="">선택하세요</option>
                        {venueOptions.map((v) => (
                            <option key={v} value={v}>{v}</option>
                        ))}
                    </select>
                </div>
                <div className="formField">
                    <label htmlFor="opponent">상대팀:</label>
                    <select
                        id="opponent"
                        value={opponent}
                        onChange={(e) => setOpponent(e.target.value)}
                        required
                    >
                        <option value="">선택하세요</option>
                        {opponentOptions.map((team) => (
                            <option key={team} value={team}>{team}</option>
                        ))}
                    </select>
                </div>
                <button type="submit">등록</button>
            </form>
            {/* 저장된 일정 목록을 리스트로 표시 */}
            <div style={{width:"100%"}}>
                <span style={{color:"#EFE7E7" ,marginBottom:"1vh", fontSize:"15px", fontWeight:"bold"}}>
                    🗓️ 등록된 일정
                </span>
            </div>
            <div className="ScheduleRegistration">
                {schedules.length === 0 ? (
                    <p>등록된 일정이 없습니다.</p>
                ) : (
                    <ul>
                        {schedules.map((sch) => (
                            <li key={sch.scheduleId}>
                                {formatDate(sch.matchDate)} {formatTime(sch.matchTime)} | {sch.homeTeam} vs. {sch.awayTeam} | 경기장: {sch.location}
                                <button
                                    className="deleteButton"
                                    onClick={() => handleDelete(sch.scheduleId)}
                                >
                                    X
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default ScheduleRegistration;
