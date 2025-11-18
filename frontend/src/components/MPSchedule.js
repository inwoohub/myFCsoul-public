import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import GameDetailModal from "../components/GameDetailModal";
import "../css/MPSchedule.css";

function MPSchedule({ schedules }) {
    const [date, setDate] = useState(new Date());
    const [activeStartDate, setActiveStartDate] = useState(new Date());
    const [isMobile, setIsMobile] = useState(window.innerWidth < 620);
    const [selectedGameSchedules, setSelectedGameSchedules] = useState([]);
    const [isGameModalOpen, setIsGameModalOpen] = useState(false);

    // 창 크기 변경 감지
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 620);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // 요일을 한글 짧은 형태로 표시
    const formatShortWeekday = (_, d) => ["일", "월", "화", "수", "목", "금", "토"][d.getDay()];

    // 날짜 포맷
    const formatLocalDate = (d) => {
        const y = d.getFullYear();
        let m = d.getMonth() + 1;
        let day = d.getDate();
        if (m < 10) m = "0" + m;
        if (day < 10) day = "0" + day;
        return `${y}-${m}-${day}`;
    };

    // 셀 컨텐츠
    const tileContent = ({ date, view }) => {
        if (view === "month") {
            const fd = formatLocalDate(date);
            if (schedules.some(s => s.matchDate === fd)) {
                return <div className="game-marker">🔥</div>;
            }
        }
        return null;
    };

    // 날짜 클릭
    const handleClickDay = (d) => {
        if (d.getMonth() !== activeStartDate.getMonth()) {
            setDate(d);
            return;
        }
        const fd = formatLocalDate(d);
        const list = schedules.filter(s => s.matchDate === fd);
        if (list.length) {
            setSelectedGameSchedules(list);
            setIsGameModalOpen(true);
        }
        setDate(d);
    };

    return (
        <div className="custom-mainschedule">
            <div className="calendar-container">
                <Calendar
                    value={date}
                    onChange={setDate}
                    onClickDay={handleClickDay}
                    formatShortWeekday={formatShortWeekday}
                    calendarType="gregory"
                    activeStartDate={activeStartDate}
                    onActiveStartDateChange={({ activeStartDate }) => setActiveStartDate(activeStartDate)}
                    tileContent={tileContent}
                    tileClassName={({ date, view }) =>
                        view === "month" && date.getMonth() === activeStartDate.getMonth() &&
                        date.getDay() >= 1 && date.getDay() <= 5
                            ? "weekday-tile"
                            : null
                    }
                    // 일(day) 렌더링
                    formatDay={(locale, d) =>
                        isMobile ? d.getDate() : `${d.getDate()}일`
                    }
                    // 월/연도 네비게이션 레이블 커스터마이징
                    formatMonthYear={(locale, d) =>
                        isMobile
                            ? `${d.getMonth() + 1}월`
                            : `${d.getFullYear()}년 ${d.getMonth() + 1}월`
                    }
                />
            </div>

            {isGameModalOpen && (
                <GameDetailModal
                    schedules={selectedGameSchedules}
                    onClose={() => setIsGameModalOpen(false)}
                />
            )}
        </div>
    );
}

export default MPSchedule;
