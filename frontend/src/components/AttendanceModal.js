// import React, { useState } from "react";
// import "../css/AttendanceModal.css";
//
// export default function AttendanceModal({ schedule, onClose, onSubmitted }) {
//     const [file, setFile] = useState(null);
//     const [uploading, setUploading] = useState(false);
//
//     const getUploadUrl = async () => {
//         if (!file) throw new Error("No file selected");
//         const res = await fetch(`/api/s3/upload-url/attendance?filename=${file.name}`,
//             {
//                 credentials: "include"
//             }
//         );
//         if (!res.ok) throw new Error("Failed to get upload URL");
//         return res.json(); // { uploadUrl, key }
//     };
//
//     const handleSubmit = async () => {
//         if (!file) return alert("사진을 선택해주세요.");
//         setUploading(true);
//         try {
//             const { uploadUrl, key } = await getUploadUrl();
//             // 1) S3에 직접 업로드
//             const putRes = await fetch(uploadUrl, { method: "PUT", body: file });
//             if (!putRes.ok) throw new Error("Upload to S3 failed");
//
//             // 2) 백엔드에 제출
//             const submitRes = await fetch("/api/mydata/submit", {
//                 method: "POST",
//                 credentials: "include",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ scheduleId: schedule.scheduleId, photoKey: key }),
//             });
//             if (!submitRes.ok) throw new Error("Submission failed");
//
//             alert("제출 완료! 관리자의 승인을 기다려주세요.");
//             onSubmitted();
//             onClose();
//         } catch (err) {
//             console.error(err);
//             alert("제출 중 오류가 발생했습니다.");
//         } finally {
//             setUploading(false);
//         }
//     };
//
//     return (
//         <div className="attendance-modal-overlay" onClick={onClose}>
//             <div className="attendance-modal-content" onClick={(e) => e.stopPropagation()}>
//                 <button className="modal-close" onClick={onClose} disabled={uploading}>X</button>
//                 <div>
//                     <span className="attendance-modal-title">직관 사진 등록</span>
//                 </div>
//                 <div style={{ marginTop: "10px", marginBottom: "10px" }}>
//                   <span className="attendance-modal-content2">
//                     {schedule.matchDate}{" "}
//                       {/*
//                       matchTime이 "19:30:00"이라면
//                       substring(0,5)로 "19:30"만 잘라냅니다.
//                     */}
//                       {schedule.matchTime.substring(0, 5)}
//                   </span>
//                     <span className="attendance-modal-content2">
//                     서울 VS{" "}
//                         {schedule.homeTeam === "서울"
//                             ? schedule.awayTeam
//                             : schedule.homeTeam}
//                   </span>
//                 </div>
//                 <div style={{ marginTop: "10px", marginBottom: "10px" }}>
//                   <span className="attendance-modal-content2">
//                     티켓 / 예매 내역 사진을 통해
//                   </span>
//                     <span className="attendance-modal-content2">
//                     제출 가능합니다.
//                   </span>
//                 </div>
//                 <input
//                     className="attendance-modal-content2"
//                     type="file"
//                     accept="image/*"
//                     onChange={(e) => setFile(e.target.files[0])}
//                     disabled={uploading}
//                 />
//                 <div className="attendance-modal-actions">
//                     <button onClick={handleSubmit} disabled={uploading}>
//                         {uploading ? "업로드 중..." : "제출하기"}
//                     </button>
//                     <button onClick={onClose} disabled={uploading}>
//                         취소
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }
import React, { useState } from "react";
import "../css/AttendanceModal.css";

export default function AttendanceModal({ schedule, onClose, onSubmitted }) {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    // S3 업로드용 Presigned URL 가져오기
    const getUploadUrl = async () => {
        if (!file) throw new Error("No file selected");
        // filename만 서버에 전달 (Content-Type 서명 제거 버전)
        const url = `/api/s3/upload-url/attendance?filename=${encodeURIComponent(file.name)}`;
        const res = await fetch(url, { credentials: "include" });
        if (!res.ok) throw new Error("Failed to get upload URL");
        return res.json(); // { uploadUrl, key }
    };

    const handleSubmit = async () => {
        if (!file) return alert("사진을 선택해주세요.");
        setUploading(true);
        try {
            // 1) Presigned URL 요청
            const { uploadUrl, key } = await getUploadUrl();
            // 2) S3에 직접 업로드 (헤더 없이)
            const putRes = await fetch(uploadUrl, {
                method: "PUT",
                body: file
            });
            if (!putRes.ok) {
                console.error(await putRes.text());
                throw new Error("Upload to S3 failed");
            }

            // 3) 백엔드에 제출
            const submitRes = await fetch("/api/mydata/submit", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    scheduleId: schedule.scheduleId,
                    photoKey: key
                }),
            });
            if (!submitRes.ok) {
                const errText = await submitRes.text();
                console.error(errText);
                throw new Error("Submission failed");
            }

            alert("제출 완료! 관리자의 승인을 기다려주세요.");
            onSubmitted();
            onClose();
        } catch (err) {
            console.error(err);
            alert("제출 중 오류가 발생했습니다: " + err.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="attendance-modal-overlay" onClick={onClose}>
            <div className="attendance-modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose} disabled={uploading}>X</button>
                <div><span className="attendance-modal-title">직관 사진 등록</span></div>
                <div style={{ margin: "10px 0" }}>
                    <span className="attendance-modal-content2">
                        {schedule.matchDate} {schedule.matchTime.substring(0,5)}
                    </span>
                    <span className="attendance-modal-content2">
                        서울 VS {schedule.homeTeam === "서울" ? schedule.awayTeam : schedule.homeTeam}
                    </span>
                </div>
                <div style={{ margin: "10px 0" }}>
                    <span className="attendance-modal-content2">
                        티켓/예매 내역 사진을 통해 제출 가능합니다.
                    </span>
                </div>
                <input
                    className="attendance-modal-content2"
                    type="file"
                    accept="image/*"
                    onChange={e => setFile(e.target.files[0])}
                    disabled={uploading}
                />
                <div className="attendance-modal-actions">
                    <button onClick={handleSubmit} disabled={uploading}>
                        {uploading ? "업로드 중..." : "제출하기"}
                    </button>
                    <button onClick={onClose} disabled={uploading}>취소</button>
                </div>
            </div>
        </div>
    );
}
