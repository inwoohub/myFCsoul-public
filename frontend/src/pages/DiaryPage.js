// src/pages/DiaryPage.js
import { useParams, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import NavigationBar from "../components/NavigationBar";
import DiaryModal from "../components/DiaryModal";
import "../css/DiaryPage.css";

const S3_BASE_URL = "";

function DiaryPage() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [imageUrls, setImageUrls] = useState({});

    // 모달 제어용 state
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingEntry, setEditingEntry] = useState(null);

    const [showViewModal, setShowViewModal] = useState(false);
    const [viewingEntry, setViewingEntry] = useState(null);
    const [userLoaded, setUserLoaded] = useState(false);

    // 로그인 유저 정보
    useEffect(() => {
        fetch("/api/user", { credentials: "include" })
            .then(res => {
                if (!res.ok) throw new Error("사용자 정보를 불러오기 실패");
                return res.json();
            })
            .then(data => {
                setUser(data);
            })
            .catch(err => console.error(err))
            .finally(() => {
                setUserLoaded(true);
            });
    }, []);

    // 내 다이어리 불러오기 (최초 로딩)
    useEffect(() => {
        if (!user) return;
        fetch(`/api/gallery/${user.userId}`, { credentials: "include" })
            .then(res => res.json())
            .then(data => {
                const sorted = data.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );
                setEntries(sorted);
                setLoading(false);
            })
            .catch(err => {
                console.error("다이어리 불러오기 실패:", err);
                setLoading(false);
            });
    }, [user]);

    // URL 파라미터 userId 변경 시 다시 불러오기
    useEffect(() => {
        if (!user || !userId) return;
        if (user.userId !== userId) {
            console.warn("⚠️ 다른 유저의 페이지를 보고 있습니다");
        }
        setLoading(true);
        fetch(`/api/gallery/${userId}`, { credentials: "include" })
            .then(res => res.json())
            .then(data => {
                const sorted = data.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );
                setEntries(sorted);
                setLoading(false);
            })
            .catch(err => {
                console.error("다이어리 불러오기 실패:", err);
                setLoading(false);
            });
    }, [user, userId]);

    // Presigned GET URL 요청
    const fetchImageUrl = async key => {
        const res = await fetch(
            `/api/s3/download-url?key=${encodeURIComponent(key)}`,
            { credentials: "include" }
        );
        const { url } = await res.json();
        return url;
    };

    useEffect(() => {
        const fetchUrls = async () => {
            const urlMap = {};
            for (const entry of entries) {
                if (entry.imageUrl) {
                    urlMap[entry.galleryId] = await fetchImageUrl(entry.imageUrl);
                }
            }
            setImageUrls(urlMap);
        };
        if (entries.length) fetchUrls();
    }, [entries]);

    // 글 추가
    const handleAddEntry = async newEntry => {
        try {
            let imageUrl = null;
            if (newEntry.imageFile) {
                const filename = newEntry.imageFile.name;
                const urlRes = await fetch(
                    `/api/s3/upload-url?filename=${encodeURIComponent(filename)}`,
                    {
                        method: "GET",
                        credentials: "include",              // ★ 세션 쿠키 포함
                        headers: { "Content-Type": "application/json" }
                    }
                );
                const { uploadUrl, key } = await urlRes.json();
                await fetch(uploadUrl, {
                    method: "PUT",
                    headers: { "Content-Type": newEntry.imageFile.type },
                    body: newEntry.imageFile
                });
                imageUrl = key;
            }

            const payload = {
                userId: user.userId,
                title: newEntry.title,
                content: newEntry.content,
                imageUrl,
                createdAt: newEntry.createdAt
            };

            const res = await fetch("/api/gallery", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error("서버 저장 실패");
            const saved = await res.json();
            setEntries(prev => [saved, ...prev]);
            setShowCreateModal(false);
        } catch (err) {
            console.error("추가 실패:", err);
            alert("업로드 또는 저장 중 오류가 발생했습니다.");
        }
    };

    // 글 수정
    const handleEditClick = entry => {
        setEditingEntry(entry);
        setShowEditModal(true);
    };
    const handleUpdateEntry = async updated => {
        try {
            let imageUrl = updated.imageUrl;
            if (updated.imageFile) {
                const filename = updated.imageFile.name;
                const urlRes = await fetch(
                    `/api/s3/upload-url?filename=${encodeURIComponent(filename)}`
                );
                const { uploadUrl, key } = await urlRes.json();
                await fetch(uploadUrl, {
                    method: "PUT",
                    headers: { "Content-Type": updated.imageFile.type },
                    body: updated.imageFile
                });
                imageUrl = key;
            }

            const payload = {
                title: updated.title,
                content: updated.content,
                imageUrl,
                createdAt: updated.createdAt
            };
            const res = await fetch(
                `/api/gallery/${updated.galleryId}`,
                {
                    method: "PUT",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                }
            );
            const newEntry = await res.json();
            setEntries(entries.map(e =>
                e.galleryId === newEntry.galleryId ? newEntry : e
            ));
            setShowEditModal(false);
            setEditingEntry(null);
        } catch (err) {
            console.error("수정 실패:", err);
            alert("수정 중 오류가 발생했습니다.");
        }
    };

    // 글 삭제
    const handleDeleteEntry = async id => {
        if (!window.confirm("정말 삭제하시겠습니까?")) return;
        try {
            await fetch(`/api/gallery/${id}`, {
                method: "DELETE",
                credentials: "include"
            });
            setEntries(entries.filter(e => e.galleryId !== id));
            setShowViewModal(false);
            setViewingEntry(null);
        } catch (err) {
            console.error("삭제 실패:", err);
            alert("삭제 중 오류가 발생했습니다.");
        }
    };

    // 모바일에서 이미지 클릭 시 미리보기 모달 열기
    const handleViewEntry = entry => {
        setViewingEntry(entry);
        setShowViewModal(true);
    };

    return (
        <div className="DiaryPage">
            <NavigationBar />

            {/* userLoaded 가 true 가 되고도 user가 없으면 로그인 유도 메시지 */}
            {userLoaded && !user ? (
                <div className="diary-login-prompt">
                    <div className="DiaryPage_nologin">
                        <span>로그인 후 이용하세요</span>
                    </div>
                </div>
            ) : (
                <div className="diary-container">
                    {user && user.userId === userId && (
                        <div className="diary-controls">
                            <button className="diary-button" onClick={() => setShowCreateModal(true)}>
                                ✏️ 글쓰기
                            </button>
                        </div>
                    )}
                    {/* 이하 기존 다이어리 리스트 렌더링 */}
                    <div className="diary-list">
                        {loading ? (
                            <div className="diary-content3">
                                <span className="diary-content3-span">로딩 중..</span>
                            </div>
                        ) : !Array.isArray(entries) ? (
                            <div className="diary-content3">
                                <span className="diary-content3-span">일기 데이터 형식 오류가 발생했습니다.</span>
                            </div>
                        ) : entries.length === 0 ? (
                            <div className="diary-content3">
                                <span className="diary-content3-span">나만의 간단한 일기를 작성하는 공간입니다.</span>
                            </div>
                        ) : (
                            entries.map(entry => {
                                const dt = new Date(entry.createdAt);
                                const formatted = `${dt.getFullYear()}.${dt.getMonth() + 1}.${dt.getDate()} ` +
                                    `${dt.getHours().toString().padStart(2, "0")}:` +
                                    `${dt.getMinutes().toString().padStart(2, "0")}`;

                                return (
                                    <div key={entry.galleryId} className="diary-card"
                                         style={{ cursor: window.innerWidth <= 768 ? "pointer" : "default"}}
                                         onClick={() => {
                                             if (window.innerWidth <= 768) handleViewEntry(entry);
                                         }}>
                                        <div className="diary-title-div">
                                            <span className="diary-title">{entry.title}</span>
                                        </div>

                                        {entry.imageUrl && (
                                            <img
                                                className="diary-img"
                                                src={imageUrls[entry.galleryId]}
                                                alt={entry.title}
                                            />
                                        )}

                                        <div className="diary-title-div">
                                            <p className="diary-content">{entry.content}</p>
                                        </div>

                                        <time className="diary-date">{formatted}</time>

                                        <div className="diary-actions">
                                            <button
                                                className="diary-button-edit"
                                                onClick={() => handleEditClick(entry)}
                                            >
                                                수정
                                            </button>
                                            <button
                                                className="diary-button-delete"
                                                onClick={() => handleDeleteEntry(entry.galleryId)}
                                            >
                                                삭제
                                            </button>
                                        </div>

                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}

            {/* 생성 모달 */}
            <DiaryModal
                isOpen={showCreateModal}
                mode="create"
                onClose={() => setShowCreateModal(false)}
                onSubmit={handleAddEntry}
            />

            {/* 수정 모달 */}
            {editingEntry && (
                <DiaryModal
                    isOpen={showEditModal}
                    mode="edit"
                    initialData={editingEntry}
                    onClose={() => {
                        setShowEditModal(false);
                        setEditingEntry(null);
                    }}
                    onSubmit={handleUpdateEntry}
                />
            )}

            {/* 뷰 모달 (모바일 이미지 클릭) */}
            <DiaryModal
                isOpen={showViewModal}
                mode="view"
                initialData={{
                    ...viewingEntry,
                    imageUrl: imageUrls[viewingEntry?.galleryId]  // presigned URL
                }}
                onClose={() => {
                    setShowViewModal(false);
                    setViewingEntry(null);
                }}
                onEdit={() => {
                    setShowViewModal(false);
                    handleEditClick(viewingEntry);
                }}
                onDelete={() => {
                    handleDeleteEntry(viewingEntry.galleryId);
                }}
            />
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

export default DiaryPage;
