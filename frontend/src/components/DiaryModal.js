// src/components/DiaryModal.jsx

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "../css/DiaryModal.css";

const S3_BASE_URL = "https://inwoobucket.s3.ap-northeast-2.amazonaws.com/";

// ISO 문자열을 한국시간 포맷으로 바꿔주는 함수
function formatKoreaDate(isoString) {
    const dt = new Date(isoString);
    const optionsDate = {
        timeZone: "Asia/Seoul",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    };
    const optionsTime = {
        timeZone: "Asia/Seoul",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    };
    const date = dt.toLocaleDateString("en-CA", optionsDate); // YYYY-MM-DD
    const time = dt.toLocaleTimeString("en-GB", optionsTime); // HH:mm:ss
    return `${date} ${time}`;
}

export default function DiaryModal({
                                       isOpen,
                                       mode = "create",    // "create" | "edit" | "view"
                                       initialData = null, // view/edit 시 { galleryId, userId, title, content, imageUrl, createdAt }
                                       onClose,
                                       onSubmit,           // create/edit 제출
                                       onEdit,             // view 모드에서 수정 눌렀을 때
                                       onDelete            // view 모드에서 삭제 눌렀을 때
                                   }) {
    // form 상태 (create/edit)
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");

    // 모달 열 때 초기화
    useEffect(() => {
        if (!isOpen) return;

        if (mode === "edit" && initialData) {
            setTitle(initialData.title || "");
            setContent(initialData.content || "");
            setPreviewUrl(initialData.imageUrl || "");
            setImageFile(null);
        } else if (mode === "create") {
            setTitle("");
            setContent("");
            setPreviewUrl("");
            setImageFile(null);
        }
    }, [mode, isOpen, initialData]);

    if (!isOpen) return null;

    // --- VIEW MODE ---
    if (mode === "view" && initialData) {
        const { title, content, imageUrl, createdAt, userId } = initialData;
        const formatted = formatKoreaDate(createdAt);

        // 로그인된 유저 ID를 전역 변수나 Context 등에서 가져오세요.
        const currentUserId = window.__CURRENT_USER_ID__;

        return (
            <div className="diary-modal-overlay" onClick={onClose}>
                <div className="diary-modal" onClick={e => e.stopPropagation()}>
                    <div>
                        <span className="diary-modal-title">{title}</span>
                    </div>
                    {imageUrl && (
                        <img className="diary-modal-img" src={imageUrl} alt={title} />
                    )}
                    <div>
                        <span className="diary-modal-content">{content}</span>
                    </div>
                    <div>
                        <span className="diary-modal-time">{formatted}</span>
                    </div>
                    <div>
                        {currentUserId === userId && (
                            <div className="diary-modal-actions">
                                <button onClick={onEdit}>수정</button>
                                <button onClick={onDelete}>삭제</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // --- CREATE / EDIT MODE ---
    const handleImageChange = e => {
        const file = e.target.files[0];
        setImageFile(file);
        if (file) setPreviewUrl(URL.createObjectURL(file));
    };

    const handleSubmit = e => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            alert("제목과 내용을 모두 입력해주세요.");
            return;
        }
        onSubmit({
            galleryId: mode === "edit" ? initialData.galleryId : undefined,
            title,
            content,
            imageFile,
            createdAt: initialData?.createdAt || new Date().toISOString()
        });
    };

    return (
        <div className="diary-modal-overlay" onClick={onClose}>
            <div className="diary-modal" onClick={e => e.stopPropagation()}>
                <button className="diary-modal-close" onClick={onClose}>×</button>
                <h2 className="diary-modal-title">
                    {mode === "create" ? "새 다이어리 작성" : "다이어리 수정"}
                </h2>

                <form className="diary-modal-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="제목"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required
                    />
                    <textarea
                        rows={5}
                        placeholder="내용"
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        required
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                    {previewUrl && (
                        <img
                            className="diary-modal-preview"
                            src={previewUrl}
                            alt="preview"
                        />
                    )}
                    <div className="diary-modal-actions">
                        <button type="button" onClick={onClose}>취소</button>
                        <button type="submit">
                            {mode === "create" ? "저장" : "수정 완료"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

DiaryModal.propTypes = {
    isOpen:     PropTypes.bool.isRequired,
    mode:       PropTypes.oneOf(["create", "edit", "view"]),
    initialData: PropTypes.shape({
        galleryId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        userId:    PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        title:     PropTypes.string,
        content:   PropTypes.string,
        imageUrl:  PropTypes.string,
        createdAt: PropTypes.string,
    }),
    onClose:    PropTypes.func.isRequired,
    onSubmit:   PropTypes.func.isRequired,
    onEdit:     PropTypes.func,
    onDelete:   PropTypes.func,
};

export { formatKoreaDate };
