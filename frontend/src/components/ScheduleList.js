import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import ScheduleRegistrationModal from "../components/ScheduleRegistrationModal";
import ScoreUpdateModal from "../components/ScoreUpdateModal";
import GameDetailModal from "../components/GameDetailModal";
import AttendanceModal from "../components/AttendanceModal";
import "../css/ScheduleList.css";


function ScheduleList({ user, className }) {
    // 기존 상태들
    const [schedules, setSchedules] = useState([]);
    const [myDataList, setMyDataList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
    const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [isScoreUpdateModalOpen, setIsScoreUpdateModalOpen] = useState(false);
    const [selectedScoreSchedule, setSelectedScoreSchedule] = useState(null);
    const [isGameModalOpen, setIsGameModalOpen] = useState(false);
    const [selectedGameSchedules, setSelectedGameSchedules] = useState([]);


    // react-calendar 및 월 네비게이션 상태 (연, 월)
    const today = new Date();
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);
    const [selectedDate, setSelectedDate] = useState(today);

    // 모바일 여부 판단 (창 너비가 620px 이하일 때는 숫자만 표기)
    const [isMobile, setIsMobile] = useState(window.innerWidth < 620);
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 620);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // 일정 데이터 불러오기
    useEffect(() => {
        fetch("/api/schedule")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("스케줄 데이터를 불러오지 못했습니다.");
                }
                return response.json();
            })
            .then((data) => {
                setSchedules(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("스케줄 데이터를 불러오는데 실패:", error);
                setLoading(false);
            });
    }, []);

    // 출석 상태 데이터 불러오기
    useEffect(() => {
        if (user) {
            fetch("/api/mydata", { credentials: "include" })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("출석 데이터를 불러오지 못했습니다.");
                    }
                    return response.json();
                })
                .then((data) => {
                    setMyDataList(data);
                })
                .catch((error) => {
                    console.error("출석 데이터를 불러오는데 실패:", error);
                });
        }
    }, [user]);

    // 출석 데이터 재조회 함수
    const fetchMyData = () => {
        if (!user) return;
        fetch("/api/mydata", { credentials: "include" })
            .then((res) => res.json())
            .then(setMyDataList)
            .catch(console.error);
    };
    useEffect(fetchMyData, [user]);

    // 모달 열기/닫기 함수들
    const openRegistrationModal = () => setIsRegistrationModalOpen(true);
    const closeRegistrationModal = () => setIsRegistrationModalOpen(false);

    const openAttendanceModal = (sch) => {
        if (!user) {
            alert("로그인 후 이용해 주세요.");
            return;
        }
        // 경기 시간이 지나야만 사진 제출 가능
        const matchTime = new Date(`${sch.matchDate}T${sch.matchTime}`);
        if (matchTime > new Date()) {
            alert("경기가 아직 진행되지 않아 사진 제출이 불가합니다.");
            return;
        }
        setSelectedSchedule(sch);
        setIsAttendanceModalOpen(true);
    };

    const closeAttendanceModal = () => {
        setIsAttendanceModalOpen(false);
        setSelectedSchedule(null);
    };

    const openScoreUpdateModal = () => setIsScoreUpdateModalOpen(true);
    const closeScoreUpdateModal = () => {
        setIsScoreUpdateModalOpen(false);
        setSelectedScoreSchedule(null);
    };

    // 출석 상태 저장 처리
    const handleAttendanceSelection = (attendedValue) => {
        if (!selectedSchedule || !user) return;
        const payload = {
            scheduleId: selectedSchedule.scheduleId,
            attended: attendedValue,
        };

        fetch("/api/mydata", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(payload),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("출석 상태를 저장하지 못했습니다.");
                }
                return response.json();
            })
            .then(() => {
                alert("출석 상태가 저장되었습니다.");
                window.location.reload();
                // 상태(myDataList)를 업데이트할 때, 기존에 해당 일정 기록이 있으면 업데이트, 없으면 추가
                setMyDataList((prevData) => {
                    const index = prevData.findIndex(
                        (item) => item.schedule.scheduleId === selectedSchedule.scheduleId
                    );
                    if (index !== -1) {
                        // 기존 항목이 있다면 복사 후 attended 값을 업데이트
                        const newData = [...prevData];
                        newData[index] = { ...newData[index], attended: attendedValue };
                        return newData;
                    } else {
                        // 기존 항목이 없으면 새 항목 추가
                        return [...prevData, { schedule: selectedSchedule, attended: attendedValue }];
                    }
                });
                closeAttendanceModal();
            })
            .catch((error) => {
                console.error("출석 상태 저장 실패:", error);
                alert("출석 상태 저장에 실패하였습니다.");
                window.location.reload();
            });
    };


    // 특정 스케줄에 대한 출석 상태 조회 함수
    const getAttendanceForSchedule = (scheduleId) => {
        const record = myDataList.find((item) => item.schedule.scheduleId === scheduleId);
        return record ? record.attended : undefined;
    };

    // 월 변경 함수: 선택된 월과 연도 업데이트 및 캘린더 날짜 변경
    const handleMonthChange = (newMonth, newYear = currentYear) => {
        setCurrentMonth(newMonth);
        setCurrentYear(newYear);
    };


    // 좌측(이전 달) 버튼 핸들러
    const handlePrevMonth = () => {
        if (currentMonth === 1) {
            handleMonthChange(12, currentYear - 1);
        } else {
            handleMonthChange(currentMonth - 1, currentYear);
        }
    };

    // 우측(다음 달) 버튼 핸들러
    const handleNextMonth = () => {
        if (currentMonth === 12) {
            handleMonthChange(1, currentYear + 1);
        } else {
            handleMonthChange(currentMonth + 1, currentYear);
        }
    };

    // 각 달에 해당하는 스케줄을 필터링하는 함수 (sch.matchDate: "YYYY-MM-DD" 형식)
    const getSchedulesForMonth = (month, year) => {
        return schedules.filter((sch) => {
            const [schYear, schMonth] = sch.matchDate.split("-");
            return parseInt(schYear, 10) === year && parseInt(schMonth, 10) === month;
        });
    };

    // 현재월의 이전, 다음 월 계산 (연도 변경 고려)
    const prevMonthInfo =
        currentMonth === 1 ? { month: 12, year: currentYear - 1 } : { month: currentMonth - 1, year: currentYear };
    const nextMonthInfo =
        currentMonth === 12 ? { month: 1, year: currentYear + 1 } : { month: currentMonth + 1, year: currentYear };

    const prevSchedules = getSchedulesForMonth(prevMonthInfo.month, prevMonthInfo.year);
    const currentSchedules = getSchedulesForMonth(currentMonth, currentYear);
    const nextSchedules = getSchedulesForMonth(nextMonthInfo.month, nextMonthInfo.year);

    const handleClickDay = (date) => {
        setSelectedDate(date);

        // 클릭한 날짜가 현재 달에 속하지 않으면, 단순히 달 변경만 처리 (모달은 열지 않음)
        if (date.getMonth() !== currentMonth - 1) {
            handleMonthChange(date.getMonth() + 1, date.getFullYear());
            return;
        }

        // 현재 달인 경우에만 스케줄이 있으면 모달을 열도록 함
        const formattedLocalDate = formatLocalDate(date);
        const schedulesForDate = schedules.filter(
            (sch) => sch.matchDate === formattedLocalDate
        );
        if (schedulesForDate.length > 0) {
            setSelectedGameSchedules(schedulesForDate);
            setIsGameModalOpen(true);
        }
    };


    function formatTime(timeString) {
        const parts = timeString.split(":");
        if (parts.length < 2) return timeString;
        return `${parts[0]}:${parts[1]}`;
    }

    // 날짜 포맷 함수: "15일(토)" 형태
    function formatDateWithDay(dateString) {
        const date = new Date(dateString);
        const day = date.getDate();
        const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
        return `${day}일(${dayOfWeek})`;
    }

    function formatLocalDate(date) {
        const year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        if (month < 10) month = "0" + month;
        if (day < 10) day = "0" + day;
        return `${year}-${month}-${day}`;
    }
    const calendarViewDate = new Date(currentYear, currentMonth - 1, 1);

    return (
        <div className={`ScheduleList ${className || ""}`}>
            {user && user.role === "admin" && (
                <div className="AdminScheduleRegistration">
                    <button onClick={openRegistrationModal}>(관리자) 일정 등록</button>
                </div>
            )}

            {/* 상단 - react‑calendar 영역 */}
            <div className="calendarWrapper">
                <span
                    className="calendarWrapperbtn"
                    onClick={() => handleMonthChange(prevMonthInfo.month, prevMonthInfo.year)}
                    style={{ cursor: "pointer" }}
                >
                    ◀
                </span>
                <Calendar
                    value={selectedDate}            // 사용자가 선택한 날짜
                    activeStartDate={new Date(currentYear, currentMonth - 1, 1)}  // 보여지는 달
                    onChange={(value) => setSelectedDate(value)}
                    onClickDay={handleClickDay}
                    calendarType="gregory"
                    // 620px 이하일 때는 숫자만, 그 이상은 "일"이 붙은 형식으로 렌더링
                    formatDay={(locale, date) =>
                        isMobile ? date.getDate() : `${date.getDate()}일`
                    }
                    tileClassName={({ date, view }) => {
                        if (view === "month" && date.getMonth() === currentMonth - 1) {
                            const dayOfWeek = date.getDay();
                            if (dayOfWeek >= 1 && dayOfWeek <= 5) {
                                return "custom-day";
                            }
                        }
                        return null;
                    }}
                    tileContent={({ date, view }) => {
                        if (view === "month") {
                            const formattedLocalDate = formatLocalDate(date);
                            const hasGame = schedules.some(
                                (sch) => sch.matchDate === formattedLocalDate
                            );
                            if (hasGame) {
                                return <div className="game-marker">🔥</div>;
                            }
                        }
                        return null;
                    }}
                />
                <span
                    className="calendarWrapperbtn"
                    onClick={() => handleMonthChange(nextMonthInfo.month, nextMonthInfo.year)}
                    style={{ cursor: "pointer" }}
                >
                    ▶
                </span>
            </div>

            {/* 하단 - 기존 일정 목록 렌더링 */}
            <div className="schedulesContainer">
                {/* ... (이전, 현재, 다음 달 일정 목록 코드) */}
            </div>

            {/* 게임 상세 모달: 날짜를 클릭했을 때 해당 날짜의 스케줄 정보 표시 */}
            {isGameModalOpen && (
                <GameDetailModal
                    schedules={selectedGameSchedules}
                    onClose={() => setIsGameModalOpen(false)}
                />
            )}

            {/* 나머지 모달들 (등록, 출석, 결과 업데이트) */}
            {isRegistrationModalOpen && <ScheduleRegistrationModal onClose={closeRegistrationModal} />}
            {isAttendanceModalOpen && selectedSchedule && (
                <AttendanceModal
                    schedule={selectedSchedule}
                    onClose={closeAttendanceModal}
                    onSubmitted={() => {
                        closeAttendanceModal();
                        fetchMyData(); // 제출 후 데이터 갱신
                    }}
                />
            )}
            {isScoreUpdateModalOpen && selectedScoreSchedule && (
                <ScoreUpdateModal
                    schedule={selectedScoreSchedule}
                    onClose={closeScoreUpdateModal}
                    onScoreUpdated={(updatedData) => {}}
                />
            )}
            <div style={{width:"100%", display:"flex",justifyContent:"center"}}>
                {/* 현재 달 */}
                <div className="monthContainer">
                    <div>
                        {currentSchedules.length === 0 ? (
                            <p className="noSchedule">등록된 일정이 없습니다.</p>
                        ) : (
                            <ul className="scheduleList">
                                {currentSchedules.map((sch) => {
                                    let opponent = "";
                                    let matchType = "";
                                    if (sch.homeTeam === "서울") {
                                        opponent = sch.awayTeam;
                                        matchType = "(H)";
                                    } else if (sch.awayTeam === "서울") {
                                        opponent = sch.homeTeam;
                                        matchType = "(A)";
                                    } else {
                                        opponent = `${sch.homeTeam} vs. ${sch.awayTeam}`;
                                    }
                                    const attendance = getAttendanceForSchedule(sch.scheduleId);
                                    const attendanceIcon =
                                        attendance === 1 ? "✅" : attendance === 0 ? "대기중" : "직관 등록하기 ✏️";
                                    const matchDateTime = new Date(`${sch.matchDate}T${sch.matchTime}`);
                                    const now = new Date();
                                    const isPast = matchDateTime < now;

                                    // 구성할 일정 텍스트 내용
                                    const scheduleText =
                                        sch.scoreHome !== null && sch.scoreAway !== null
                                            ? sch.homeTeam === "서울"
                                                ? `${sch.homeTeam} ${sch.scoreHome} : ${sch.scoreAway} ${opponent}`
                                                : `${opponent} ${sch.scoreHome} : ${sch.scoreAway} ${sch.awayTeam}`
                                            : `서울 vs ${opponent}`;

                                    return (
                                        <li key={sch.scheduleId} className="scheduleItem">
                                            <div className="scheduleInfo">
                                            <span className="scheduleDate">
                                                {formatDateWithDay(sch.matchDate)}
                                            </span>
                                                <span className="scheduleTime">
                                                {formatTime(sch.matchTime)}
                                            </span>
                                                <span>
                                                {sch.scoreHome !== null && sch.scoreAway !== null ? (
                                                    sch.homeTeam === "서울" ? (
                                                        <span>
                                                    {/* '서울'이 홈팀인 경우 */}
                                                            <span
                                                                style={{
                                                                    color:
                                                                        sch.scoreHome > sch.scoreAway
                                                                            ? "red"
                                                                            : "inherit",
                                                                }}>
                                                        {sch.homeTeam}
                                                    </span>
                                                            {` ${sch.scoreHome} : ${sch.scoreAway} `}
                                                            <span
                                                                style={{color: sch.scoreHome < sch.scoreAway
                                                                        ? "red"
                                                                        : "inherit",}}>
                                                        {opponent}
                                                    </span>
                                                </span>
                                                    ) : (
                                                        <span>
                                                    {/* '서울'이 원정팀인 경우 */}
                                                            <span
                                                                style={{
                                                                    color:
                                                                        sch.scoreHome > sch.scoreAway
                                                                            ? "red"
                                                                            : "inherit",}}
                                                            >{opponent}
                                                    </span>
                                                            {` ${sch.scoreHome} : ${sch.scoreAway} `}
                                                            <span
                                                                style={{color: sch.scoreHome < sch.scoreAway ? "red" : "inherit",}}
                                                            >{sch.awayTeam}
                                                    </span>
                                                </span>
                                                    )) : (`서울 vs ${opponent}`)}
                                                    {matchType && ` ${matchType}`}
                                            </span>

                                                <span
                                                    className="scheduleDetail"
                                                    onClick={e => {
                                                        e.stopPropagation();
                                                        if (!user) {
                                                            alert("로그인 후 이용해 주세요.");
                                                            return;
                                                        }
                                                        if (!isPast) {
                                                            alert("경기가 아직 진행되지 않아 사진 제출이 불가합니다.");
                                                            return;
                                                        }
                                                        // “직관 등록하기 ✏️” 상태에서만 모달 열기
                                                        if (attendanceIcon === "직관 등록하기 ✏️") {
                                                            openAttendanceModal(sch);
                                                        }
                                                    }}
                                                    style={{
                                                        cursor: attendanceIcon === "직관 등록하기 ✏️" ? "pointer" : "default"
                                                    }}
                                                >
            {attendanceIcon}
          </span>


                                            </div>
                                            {user && user.role === "admin" && (
                                                <button
                                                    className="scoreUpdateBtn"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedScoreSchedule(sch);
                                                        openScoreUpdateModal();
                                                    }}
                                                >
                                                    결과 등록✏️
                                                </button>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </div>
            </div>




            {isRegistrationModalOpen && <ScheduleRegistrationModal onClose={closeRegistrationModal} />}

            {isScoreUpdateModalOpen && selectedScoreSchedule && (
                <ScoreUpdateModal
                    schedule={selectedScoreSchedule}
                    onClose={closeScoreUpdateModal}
                    onScoreUpdated={(updatedData) => {}}
                />
            )}
        </div>
    );
}

export default ScheduleList;
