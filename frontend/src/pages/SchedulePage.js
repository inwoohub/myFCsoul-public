import React, { useState, useEffect } from "react";
import NavigationBar from "../components/NavigationBar";
import ScheduleList from "../components/ScheduleList";
import AttendanceDoughnutChart from "../components/AttendanceDoughnutChart";
import ScheduleWinRateChart from "../components/ScheduleWinRateChart";
import "../css/SchedulePage.css";

function SchedulePage() {
    const [user, setUser] = useState(null);
    const [myDataList, setMyDataList] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [loadingSchedules, setLoadingSchedules] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 620);

    // 화면 크기 변경 감지 (620px 이하이면 mobile로 설정)
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 620);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // 사용자 정보 불러오기
    useEffect(() => {
        fetch(`/api/user`, { credentials: "include" })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("사용자 정보를 불러오지 못했습니다.");
                }
                return response.json();
            })
            .then((data) => {
                if (data && data.nickname) {
                    setUser(data);
                }
            })
            .catch((error) => console.error("에러:", error));
    }, []);

    // MyData(직관 데이터) 불러오기
    useEffect(() => {
        if (user) {
            fetch(`/api/mydata`, { credentials: "include" })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("출석 데이터를 불러오지 못했습니다.");
                    }
                    return response.json();
                })
                .then((data) => setMyDataList(data))
                .catch((error) =>
                    console.error("출석 데이터를 불러오는데 실패:", error)
                );
        }
    }, [user]);

    // 스케줄 전체 데이터 불러오기
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

    // 직관 관련 승, 무, 패 집계 (myDataList 기반)
    const attendanceWinCount = myDataList.filter(
        (item) => item.attended === 1 && item.schedule.result === "승"
    ).length;
    const attendanceDrawCount = myDataList.filter(
        (item) => item.attended === 1 && item.schedule.result === "무"
    ).length;
    const attendanceLoseCount = myDataList.filter(
        (item) => item.attended === 1 && item.schedule.result === "패"
    ).length;

    // 전체 경기 중 결과가 등록된 경기만 필터링 및 집계 (schedules 기반)
    const finishedSchedules = schedules.filter(
        (schedule) => schedule.result !== null
    );
    const scheduleWinCount = finishedSchedules.filter(
        (schedule) => schedule.result === "승"
    ).length;
    const scheduleDrawCount = finishedSchedules.filter(
        (schedule) => schedule.result === "무"
    ).length;
    const scheduleLoseCount = finishedSchedules.filter(
        (schedule) => schedule.result === "패"
    ).length;

    if (loadingSchedules) {
        return <div style={{backgroundColor:"#212121" ,height:"100vh"}}>
            <NavigationBar className="NavigationBar" />
            <div style={{width:"100%",height:"100%",display:"flex",justifyContent:"center"}}>
                <span class="loader" style={{marginTop:"30vh"}}></span>
            </div>
        </div>;
    }

    return (
        <div className="SchedulePage">
            <NavigationBar className="NavigationBar" />

            <div className="SchedulePage2">
                {/* 스케줄 콘텐츠 영역 */}
                <div className="ScheduleContent">
                    <ScheduleList className="ScheduleList" user={user} />
                </div>

                {/* 모바일일 경우 ScheduleStatistics가 ScheduleContent 아래에 세로로 쌓입니다 */}
                <div className="ScheduleStatistics">
                    <div style={{ display:"flex",justifyContent:"center",color: "#f5f5f5", marginTop: "2vh", marginBottom: "4vh", marginLeft: "2vw", fontSize: "1.5rem", fontWeight: "bold" }}>
                        <span>2025시즌 FC서울</span>
                    </div>

                    {/* flex 방향을 조건부로 설정합니다 */}
                    <div style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        gap: "3vw",
                        flexDirection: isMobile ? "column" : "row"
                    }}>
                        {/* 620px 미만일 경우 ScheduleWinRateChart는 렌더링하지 않음 */}
                        { !isMobile && (
                            <ScheduleWinRateChart
                                winCount={scheduleWinCount}
                                drawCount={scheduleDrawCount}
                                loseCount={scheduleLoseCount}
                            />
                        )}
                        <AttendanceDoughnutChart
                            winCount={attendanceWinCount}
                            drawCount={attendanceDrawCount}
                            loseCount={attendanceLoseCount}
                        />
                    </div>
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

export default SchedulePage;
