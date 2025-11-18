import React, { useState, useEffect } from "react";
import "../css/MPRanking.css";

function MPRanking() {
    const [attendanceRank, setAttendanceRank] = useState([]);
    const [winRateRank, setWinRateRank]       = useState([]);

    useEffect(() => {
        fetch("/api/rankings", { credentials: "include" })
            .then(res => res.json())
            .then(data => {
                setAttendanceRank(data.attendanceKings);
                setWinRateRank(data.winFairies);
            })
            .catch(console.error);
    }, []);

    const renderList = (list, countKey, isPercent = false) =>
        list.map((item, i) => {
            // 숫자로 변환 후 소수점 첫째 자리까지 반올림
            const raw = Number(item[countKey]);
            const displayCount = isPercent ? raw.toFixed(1) : raw;

            return (
                <li key={item.nickname} className={`rank-item top${i + 1}`}>
                    <span className="rank">{i + 1}위</span>
                    <span className="name">👑{item.nickname}</span>
                    <span className="count">
            {displayCount}
                        {isPercent && "%"}
          </span>
                </li>
            );
        });

    return (
        <div className="MPRankingPage">
            <div className="rankingSection">
                <span className="Ranking_span">🏆 직관왕</span>
                <ol className="rankingList">
                    {renderList(attendanceRank, "attendanceCount")}
                </ol>
            </div>

            <div className="rankingSection">
                <span className="Ranking_span">🏆 승리요정</span>
                <ol className="rankingList">
                    {renderList(winRateRank, "winRate", true)}
                </ol>
            </div>
        </div>
    );
}

export default MPRanking;
