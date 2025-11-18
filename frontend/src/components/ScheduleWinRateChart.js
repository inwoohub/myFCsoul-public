import React from "react";
import { Doughnut } from "react-chartjs-2";
import "chart.js/auto"; // 필요한 Chart.js 요소 자동 등록
import ChartDataLabels from "chartjs-plugin-datalabels"; // 플러그인 import
import "../css/AttendanceDoughnutChart.css";  // CSS 파일 import

// 헬퍼 함수: 소수점 이하가 0이면 정수, 아니면 소수점 1자리까지 반환
const formatPercentage = (value) => {
    return value % 1 === 0 ? value.toString() : value.toFixed(1);
};

function ScheduleWinRateChart({ winCount, drawCount, loseCount }) {
    // 전체 경기 수 계산
    const total = winCount + drawCount + loseCount;
    // 승률 계산 (전체 경기 수가 0이면 "0" 으로, 아니면 헬퍼 함수 적용)
    const computedWinRate = total > 0 ? (winCount / total) * 100 : 0;
    const winRate = formatPercentage(computedWinRate);

    const data = {
        labels: ["승리", "무승부", "패배"],
        datasets: [
            {
                data: [winCount, drawCount, loseCount],
                backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384"],
            },
        ],
    };

    const options = {
        maintainAspectRatio: false,
        cutout: "60%", // 도넛 차트의 두께 설정
        plugins: {
            legend: {
                display: false, // 범례 숨김
            },
            datalabels: {
                // 각 도넛 슬라이스 위에 퍼센트 표시
                formatter: (value) => {
                    let perc = total > 0 ? (value / total) * 100 : 0;
                    return formatPercentage(perc) + "%";
                },
                color: "#fff", // 텍스트 색상
                font: {
                    size: 10,
                    weight: "bold",
                },
                anchor: "center",
                align: "center",
            },
        },
        animation: {
            duration: 1500,
            easing: "easeInOutQuad",
        },
    };

    return (
        <div style={{ height: "50vh" }}>
            <div className="Chart_title">
                <span>2025 FC서울</span>
            </div>
            <div className="attendance-doughnut-container">
                <Doughnut data={data} options={options} plugins={[ChartDataLabels]} />
            </div>
            <div>
                <div className="Schedule_Statistics_btn_container">
                    <div className="Schedule_Statistics_btn">전체 : {total}경기</div>
                </div>
            </div>
            <div>
                <div className="Schedule_Statistics_btn_container">
                    <div className="Schedule_Statistics_btn">
                        {winCount}승 {drawCount}무 {loseCount}패
                    </div>
                </div>
            </div>
            <div>
                <div className="Schedule_Statistics_btn_container">
                    <div className="Schedule_Statistics_btn">승률 : {winRate}%</div>
                </div>
            </div>
        </div>
    );
}

export default ScheduleWinRateChart;
