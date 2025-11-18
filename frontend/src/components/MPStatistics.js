import React from "react";
import { Doughnut } from "react-chartjs-2";
import "chart.js/auto"; // 필요한 Chart.js 요소 자동 등록
import ChartDataLabels from "chartjs-plugin-datalabels"; // 플러그인 import
import "../css/AttendanceDoughnutChart.css";  // CSS 파일 import
import "../css/MPStatistics.css";

// 숫자를 받아 소수점 이하가 0이면 정수로, 아니면 소수점 1자리까지 반환하는 헬퍼 함수
const formatPercentage = (value) => {
    return value % 1 === 0 ? value.toString() : value.toFixed(1);
};

function MPStatistics({ winCount, drawCount, loseCount, loading }) {
    // 로딩 중 표시
    if (loading) {
        return (
            <div className="MPStatisticsPage" style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "20vh" }}>
                <span className="loader"></span>
                <div style={{ color: "#EFE7E7", marginTop: "1rem" }}>불러오는 중...</div>
            </div>
        );
    }

    const total = winCount + drawCount + loseCount;
    if (total === 0) {
        return (
            <div className="MPStatisticsPage" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div className="Chart_title">
                    <span style={{ marginTop: "2vh" }}>나의 FC서울</span>
                </div>
                <div className="AttendanceDoughnutChart_btn" style={{ width: "70%", marginTop: "20vh" }}>
                    <span style={{ color: "#EFE7E7" }}>
                        현재 등록된 직관 정보가 없습니다.
                    </span>
                </div>
            </div>
        );
    }

    const computedWinRate = total > 0 ? (winCount / total) * 100 : 0;
    const winRate = formatPercentage(computedWinRate);

    const data = {
        labels: ['승리', '무승부', '패배'],
        datasets: [
            {
                data: [winCount, drawCount, loseCount],
                backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'],
            },
        ],
    };

    const options = {
        maintainAspectRatio: false,
        cutout: '60%',
        plugins: {
            legend: { display: false },
            datalabels: {
                formatter: (value) => {
                    const perc = total > 0 ? (value / total) * 100 : 0;
                    return formatPercentage(perc) + '%';
                },
                color: "#fff",
                font: { size: 10, weight: "bold" },
                anchor: 'center',
                align: 'center',
            },
        },
        animation: { duration: 1500, easing: 'easeInOutQuad' },
    };

    return (
        <div className="MPStatisticsPage">
            <div style={{ color: "#EFE7E7", width: "100%", display: "flex", marginTop: "2vh", justifyContent: "center", fontSize: "16px", fontWeight: "bold" }}>
                <span>나의 FC서울</span>
            </div>
            <div className="attendance-doughnut-container">
                <Doughnut data={data} options={options} plugins={[ChartDataLabels]} />
            </div>
            <div>
                <div className="Main_Statistics_btn_container">
                    <div className="Main_Statistics_btn">
                        전체 : {total}경기
                    </div>
                </div>
            </div>
            <div>
                <div className="Main_Statistics_btn_container">
                    <div className="Main_Statistics_btn">
                        {winCount}승 {drawCount}무 {loseCount}패
                    </div>
                </div>
            </div>
            <div>
                <div className="Main_Statistics_btn_container">
                    <div className="Main_Statistics_btn">
                        승률 : {winRate}%
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MPStatistics;