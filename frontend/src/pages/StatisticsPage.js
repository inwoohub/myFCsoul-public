
import React, { useState, useEffect } from "react";
import "../css/StatisticsPage.css";
import NavigationBar from "../components/NavigationBar";

function StatisticsPage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [prediction, setPrediction] = useState("");
    const [predictedToday, setPredictedToday] = useState(false);

    // 마운트 시: 사용자 정보 + 예측 상태 확인 및 저장된 결과 가져오기
    useEffect(() => {
        fetch("/api/user", { credentials: "include" })
            .then(res => {
                if (!res.ok) throw new Error("사용자 정보를 불러오지 못했습니다.");
                return res.json();
            })
            .then(data => {
                setUser(data);
                if (data.lastPredictionAt) {
                    const lastDate = new Date(data.lastPredictionAt);
                    const today = new Date();
                    if (lastDate.toDateString() === today.toDateString()) {
                        setPredictedToday(true);
                        // 저장된 예측 결과 가져오기
                        fetch("/api/prediction", { credentials: "include" })
                            .then(res2 => {
                                if (!res2.ok) throw new Error("이전 예측 결과를 불러오지 못했습니다.");
                                return res2.json();
                            })
                            .then(prev => setPrediction(prev.prediction))
                            .catch(err => console.error(err));
                    }
                }
            })
            .catch(err => console.error("user fetch error:", err));
    }, []);

    const handlePredict = async () => {
        if (!user?.userId) {
            setPrediction("먼저 로그인해 주세요.");
            return;
        }
        if (predictedToday) {
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(
                `/api/predict?userId=${user.userId}`,
                { method: "POST", credentials: "include" }
            );
            if (!res.ok) throw new Error("예측 실패");
            const body = await res.json();
            setPrediction(body.prediction);
            setPredictedToday(true);
        } catch (e) {
            console.error(e);
            setPrediction("예측 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const renderButtonText = () => {
        if (!user?.userId) return "로그인 후 이용하세요";
        if (predictedToday) return "오늘은 이미 예측을 완료했습니다.";
        return "예측하기";
    };

    return (
        <div className="StatisticsPage">
            <NavigationBar />

            <div className="StatisticsPageTop" style={{ position: "relative" }}>
                <img className="Seoul_ai_png" alt="Seoul_ai" src="/Seoul_ai.png" />
                {loading && (
                    <div className="loader-overlay">
                        <span className="loader"></span>
                    </div>
                )}
            </div>

            <div className="StatisticsPageMiddle">
                <span className="desktop-text">
                    AI와 나의 직관을 결합한 승부 예측, 다음 경기 결과를 미리 확인해 보세요!
                </span>
                <span className="mobile-text">
                    AI와 나의 직관을 결합한 승부 예측,
                    <br className="mobile-only" />
                    다음 경기 결과를 미리 확인해 보세요!
                </span>
            </div>

            {/* 예측 버튼 */}
            {!prediction && (
                <div
                    className="StatisticsPageBottom"
                    onClick={handlePredict}
                    style={{
                        cursor: (!user?.userId || predictedToday || loading) ? "not-allowed" : "pointer",
                        opacity: (!user?.userId || predictedToday || loading) ? 0.5 : 1
                    }}
                >
                    {renderButtonText()}
                </div>
            )}

            {/* 예측 결과 */}
            {prediction && (
                <div className="prediction-result2">
                    <div>
                        <span style={{color:"gray"}}>1일 1회 제한, 오늘은 이미 예측을 완료했습니다.</span>
                    </div>
                    <div>
                        <p style={{ whiteSpace: 'pre-wrap' }}>{prediction}</p>
                    </div>
                </div>
            )}
            <div className="Main_footer" style={{marginTop:"30vh"}}>
                <div style={{marginTop:"10px", fontSize:"13px"}}>
                    <span>
                        * 랭킹은 매일 자정에 업데이트 됩니다. *
                    </span>
                </div>
            </div>
        </div>
    );
}
export default StatisticsPage;
