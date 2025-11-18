import React, { useState, useEffect } from "react";
import NavigationBar from "../components/NavigationBar";
import MPSchedule from "../components/MPSchedule";
import MPStatistics from "../components/MPStatistics";
import MPRanking from "../components/MPRanking";
import "../css/MainPage.css";

function MainPage() {
    const [schedules, setSchedules] = useState([]);
    const [loadingSchedules, setLoadingSchedules] = useState(true);
    const [myDataList, setMyDataList] = useState([]);
    const [loadingMyData, setLoadingMyData] = useState(true);

    // 슬라이더용 이미지 배열
    const images = [
        "/mainpage1.jpg",
        "/mainpage2.jpg",
        "/mainpage3.jpg",
        "/mainpage4.jpg",
    ];
    const [currentIdx, setCurrentIdx] = useState(0);

    // 자동 슬라이드: 5초마다 인덱스 변경
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIdx(idx => (idx + 1) % images.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    // 스케줄 데이터 API 호출
    useEffect(() => {
        fetch(`/api/schedule`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("스케줄 데이터를 불러오지 못했습니다.");
                }
                return response.json();
            })
            .then((data) => {
                setSchedules(data);
                setLoadingSchedules(false);
            })
            .catch((error) => {
                console.error("스케줄 데이터 로딩 실패:", error);
                setLoadingSchedules(false);
            });
    }, []);

    // 직관 데이터(API mydata) API 호출
    useEffect(() => {
        fetch(`/api/mydata`, { credentials: "include" })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("출석 데이터를 불러오지 못했습니다.");
                }
                return response.json();
            })
            .then((data) => {
                setMyDataList(data);
                setLoadingMyData(false);
            })
            .catch((error) => {
                console.error("출석 데이터 로딩 실패:", error);
                setLoadingMyData(false);
            });
    }, []);



    // myDataList를 바탕으로 승, 무, 패 집계 (예: item.schedule.result에 "승", "무", "패"가 기록되어 있다고 가정)
    const winCount = myDataList.filter(
        (item) => item.attended === 1 && item.schedule.result === "승"
    ).length;
    const drawCount = myDataList.filter(
        (item) => item.attended === 1 && item.schedule.result === "무"
    ).length;
    const loseCount = myDataList.filter(
        (item) => item.attended === 1 && item.schedule.result === "패"
    ).length;

    return (
        <div className="MainPage">
            <NavigationBar className="NavigationBar" />
            <div className="MainPageTop">
                <div className="slider-container">
                    {/* 슬라이더 이미지 */}
                    <img
                        className="MainPage_homeimage"
                        alt={`slider-${currentIdx}`}
                        src={images[currentIdx]}
                    />
                </div>
                {/* 오른쪽: FC서울 링크 */}
                <div className="MainPageTop-right2">
                    <aside className="MainPageTop-right">
                        <h2 className="MainPageLinks-title"> ⚫️🔴 FC서울 바로가기 ⚫️🔴</h2>
                        <ul className="MainPageLinks">
                            <li className="MainPageLinkItem">
                                <a
                                    href="https://www.fcseoul.com/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    🏠 FC서울 공식 홈페이지
                                </a>
                            </li>
                            <li className="MainPageLinkItem">
                                <a
                                    href="https://www.instagram.com/fcseoul/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    📸 FC서울 인스타그램
                                </a>
                            </li>
                            <li className="MainPageLinkItem">
                                <a
                                    href="https://www.fcseoul.com/tickets/reserveSingleTicket"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    🎫 FC서울 예매하기
                                </a>
                            </li>
                            <li className="MainPageLinkItem">
                                <a
                                    href="https://fcseoulite.me/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    🤝 서울라이트
                                </a>
                            </li>
                        </ul>
                    </aside>
                </div>

            </div>
            <div className="MainPagebottom_2">
                <div className="MainPagebottom">
                    {/* 스케줄 데이터는 MPSchedule 컴포넌트에 props로 전달 */}
                    <MPSchedule className="MPSchedule" schedules={schedules} />
                    {/* 분석된 직관 데이터를 MPStatistics에 props로 전달 */}
                    <MPStatistics
                        className="MPStatistics"
                        winCount={winCount}
                        drawCount={drawCount}
                        loseCount={loseCount}
                    />
                    <MPRanking className="MPRanking" />
                </div>
            </div>

            <div className="Main_footer">
                <div style={{marginTop:"10px", fontSize:"13px"}}>
                    <span>
                        * 랭킹은 매일 자정에 업데이트 됩니다. *
                    </span>
                </div>
            </div>
        </div>
    );
}

export default MainPage;
