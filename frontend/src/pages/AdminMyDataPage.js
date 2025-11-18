import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../css/AdminMyDataPage.css";
import NavigationBar from "../components/NavigationBar";

const AdminMyDataPage = () => {
    const [pendingList, setPendingList] = useState([]);
    const [imageUrls, setImageUrls] = useState({});
    const [previewUrl, setPreviewUrl] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const navigate = useNavigate();

    // 0) 로그인된 사용자 정보(역할) 가져오기
    useEffect(() => {
        fetch('/api/user', { credentials: 'include' })
            .then(res => {
                if (!res.ok) throw new Error('사용자 정보를 불러올 수 없습니다.');
                return res.json();
            })
            .then(data => {
                setUserRole(data.role);
                // 소문자 'admin' 이 아니면 홈으로 리다이렉트
                if (data.role !== 'admin') {
                    navigate('/', { replace: true });
                }
            })
            .catch(() => {
                navigate('/', { replace: true });
            });
    }, [navigate]);

    // 1) 대기 중인 출석 요청 불러오기 (role==='admin' 일 때만)
    useEffect(() => {
        if (userRole !== 'admin') return;

        fetch('/api/admin/mydata/pending', { credentials: 'include' })
            .then(res => {
                if (!res.ok) throw new Error('데이터 불러오기 실패');
                return res.json();
            })
            .then(setPendingList)
            .catch(console.error);
    }, [userRole]);

    // 2) photoKey → 프리사인드 URL 요청
    useEffect(() => {
        if (!pendingList.length) return;

        (async () => {
            const urlMap = {};
            await Promise.all(
                pendingList.map(async d => {
                    if (d.photoKey) {
                        const res = await fetch(
                            `/api/s3/download-url?key=${encodeURIComponent(d.photoKey)}`,
                            { credentials: 'include' }
                        );
                        if (!res.ok) throw new Error('URL 발급 실패');
                        const { url } = await res.json();
                        urlMap[d.mydataId] = url;
                    }
                })
            );
            setImageUrls(urlMap);
        })().catch(console.error);
    }, [pendingList]);

    // 3) 승인/거절
    const handleApprove = id => {
        fetch(`/api/admin/mydata/${id}/approve`, {
            method: 'POST',
            credentials: 'include'
        })
            .then(res => {
                if (!res.ok) throw new Error('승인 실패');
                setPendingList(lst => lst.filter(item => item.mydataId !== id));
            })
            .catch(console.error);
    };

    const handleReject = id => {
        fetch(`/api/admin/mydata/${id}/reject`, {
            method: 'POST',
            credentials: 'include'
        })
            .then(res => {
                if (!res.ok) throw new Error('거절 실패');
                setPendingList(lst => lst.filter(item => item.mydataId !== id));
            })
            .catch(console.error);
    };

    return (
        <div>
            <NavigationBar />
            <div className="admin-pending-container">
                <div className="admin-pending-titlebox">
                    <span className="admin-pending-title">출석 승인 대기 목록</span>
                </div>
                <ul className="admin-pending-list">
                    {pendingList.map(d => {
                        const isHome = d.schedule.homeTeam === "서울";
                        return (
                            <li key={d.mydataId} className="admin-pending-item">
                                <div className="admin-pending-image" >
                                    <img
                                        src={imageUrls[d.mydataId]}
                                        alt="출석 사진"
                                        onClick={() => setPreviewUrl(imageUrls[d.mydataId])}
                                    />
                                </div>
                                <div className="admin-pending-info">
                                    {d.schedule.matchDate} {d.schedule.matchTime} — {d.user.nickname}
                                    <br/>
                                    <span>
                                    {d.schedule.homeTeam} vs {d.schedule.awayTeam}
                                        {isHome ? " (H)" : d.schedule.awayTeam === "서울" ? " (A)" : ""}
                                </span>
                                </div>
                                <div className="admin-pending-actions">
                                    <button onClick={() => handleApprove(d.mydataId)}>승인</button>
                                    <button onClick={() => handleReject(d.mydataId)}>거절</button>
                                </div>
                            </li>
                        );
                    })}
                </ul>

                {/* 이미지 확대 모달 */}
                {previewUrl && (
                    <div className="Admin-image-preview-overlay" onClick={() => setPreviewUrl(null)}>
                        <div className="Admin-image-preview-content" onClick={e => e.stopPropagation()}>
                            <img src={previewUrl} alt="확대된 출석 사진" />
                            <button className="Admin-modal-close" onClick={() => setPreviewUrl(null)}>×</button>
                        </div>
                    </div>
                )}
            </div>
            <div className="Admin-page-footer">
            </div>
        </div>

    );
};

export default AdminMyDataPage;
