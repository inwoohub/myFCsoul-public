import React from "react";
import { Doughnut } from "react-chartjs-2";
import "chart.js/auto"; // 필요한 Chart.js 요소 자동 등록
import ChartDataLabels from "chartjs-plugin-datalabels"; // 플러그인 import
import "../css/AttendanceDoughnutChart.css";  // CSS 파일 import

// 숫자를 받아 소수점 이하가 0이면 정수로, 아니면 소수점 1자리까지 반환하는 헬퍼 함수
const formatPercentage = (value) => {
    // value는 퍼센트 값을 의미 (예: 50 또는 50.3)
    return value % 1 === 0 ? value.toString() : value.toFixed(1);
};

function AttendanceDoughnutChart({ winCount, drawCount, loseCount }) {
    const total = winCount + drawCount + loseCount;
    if (total === 0) {
        return (
            <div style={{ height: "50vh", display: "flex", flexDirection: "column",  alignItems: "center" }}>
                <div className="Chart_title">
                    <span>나의 FC서울</span>
                </div>
                <div className="AttendanceDoughnutChart_btn">
                    <span style={{color:"#EFE7E7"}}>
                        현재 등록된 직관 정보가 없습니다.
                    </span>
                </div>
            </div>
        );
    }

    // 승률 계산: total이 0이면 0, 아니면 (승리 경기 수 / 전체 경기 수) * 100 값을 계산
    const computedWinRate = total > 0 ? (winCount / total) * 100 : 0;
    // formatPercentage 헬퍼를 사용하여 소수점 이하가 0이면 정수, 아니면 소수점 1자리까지 표기
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
        cutout: '60%', // 도넛 차트의 두께 설정
        plugins: {
            legend: {
                display: false, // 범례 숨김
            },
            datalabels: {
                // 각 도넛 슬라이스 위에 퍼센트 표시
                formatter: (value) => {
                    let perc = total > 0 ? (value / total) * 100 : 0;
                    return formatPercentage(perc) + '%';
                },
                color: "#fff", // 텍스트 색상
                font: {
                    size: 10,
                    weight: "bold",
                },
                anchor: 'center',
                align: 'center',
            },
        },
        animation: {
            duration: 1500,
            easing: 'easeInOutQuad',
        },
    };

    return (
        <div style={{ height: "50vh"}}>
            <div className="Chart_title">
                <span>나의 FC서울</span>
            </div>
            <div className="attendance-doughnut-container">
                <Doughnut data={data} options={options} plugins={[ChartDataLabels]} />
            </div>
            <div>
                <div className="Schedule_Statistics_btn_container">
                    <div className="Schedule_Statistics_btn">
                        전체 : {total}경기
                    </div>
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
                    <div className="Schedule_Statistics_btn">
                        승률 : {winRate}%
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AttendanceDoughnutChart;
