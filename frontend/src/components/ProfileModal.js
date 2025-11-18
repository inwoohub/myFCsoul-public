// import React, { useState, useEffect } from "react";
// import "../css/ProfileModal.css";
//
// function ProfileModal({ user, onClose }) {
//     const [nickname, setNickname] = useState("");
//     const [error, setError] = useState("");
//
//     // 영문(A-Z, a-z) 및 한글만 허용하는 정규식
//     const validRegex = /^[A-Za-zㄱ-ㅎㅏ-ㅣ가-힣]*$/;
//
//     // 영문 1 → 0.5, 한글 1 → 1 로 가중치 계산
//     const calcWeightedLength = (str) => {
//         const enCount = (str.match(/[A-Za-z]/g) || []).length;
//         const korCount = (str.match(/[ㄱ-ㅎㅏ-ㅣ가-힣]/g) || []).length;
//         return enCount * 0.5 + korCount;
//     };
//
//     // 모달 초기화
//     useEffect(() => {
//         if (user) {
//             setNickname(user.nickname);
//             setError("");
//         }
//     }, [user]);
//
//     const handleChange = (e) => {
//         const value = e.target.value;
//         // 허용된 문자만
//         if (!validRegex.test(value)) {
//             setError("한글 및 영문만 입력 가능합니다.");
//             return;
//         }
//         // 길이 제한
//         const len = calcWeightedLength(value);
//         if (len > 6) {
//             setError("최대 6글자(영문 0.5, 한글 1)까지만 입력 가능합니다.");
//             return;
//         }
//         setNickname(value);
//         setError("");
//     };
//
//     const handleSave = () => {
//         if (!nickname.trim()) {
//             setError("닉네임을 입력해주세요.");
//             return;
//         }
//         fetch("/api/profile", {
//             method: "PUT",
//             headers: { "Content-Type": "application/json" },
//             credentials: "include",
//             body: JSON.stringify({ nickname }),
//         })
//             .then(async (res) => {
//                 const text = await res.text();
//                 if (!res.ok) {
//                     throw new Error(text || "닉네임 변경에 실패했습니다.");
//                 }
//                 return JSON.parse(text);
//             })
//             .then((updatedUser) => {
//                 onClose(updatedUser);
//                 alert("닉네임이 변경되었습니다.");
//             })
//             .catch((err) => {
//                 setError(err.message);
//             });
//     };
//
//     const handleLogout = () => {
//         fetch("/logout", {
//             method: "POST",
//             credentials: "include",
//             headers: { "Content-Type": "application/x-www-form-urlencoded" },
//         }).finally(() => {
//             window.location.href = "/";
//         });
//     };
//
//     return (
//         <div className="profile-modal-overlay" onClick={() => onClose()}>
//             <div
//                 className="profile-modal-content"
//                 onClick={(e) => e.stopPropagation()}
//             >
//                 <button className="modal-close" onClick={() => onClose()}>X</button>
//                 <h2>프로필 수정</h2>
//
//                 <label>닉네임</label>
//                 <input type="text" value={nickname} onChange={handleChange} />
//                 {error && <div className="error-text" style={{ marginTop: "10px",color:"red" }}>{error}</div>}
//                 <div className="error-text" style={{marginTop:"10px"}}>
//                     최대 6글자(영문 0.5, 한글 1)까지만 입력 가능합니다.
//                 </div>
//                 <div className="error-text">
//                     일주일에 한 번 닉네임을 변경할 수 있습니다.
//                 </div>
//
//                 <div className="profile-modal-actions">
//                     <button onClick={handleSave} disabled={!!error}>저장</button>
//                     <button onClick={() => onClose()}>취소</button>
//                 </div>
//
//                 <div className="logout-section">
//                     <button className="logout-button" onClick={handleLogout}>
//                         로그아웃
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }
//
// export default ProfileModal;


// src/components/ProfileModal.js
import React, { useState, useEffect } from "react";
import "../css/ProfileModal.css";

function ProfileModal({ user, onClose }) {
    const [nickname, setNickname] = useState("");
    const [error, setError] = useState("");

    // 영문(A-Z, a-z) 및 한글만 허용하는 정규식
    const validRegex = /^[A-Za-zㄱ-ㅎㅏ-ㅣ가-힣]*$/;

    // 영문 1 → 0.5, 한글 1 → 1 로 가중치 계산
    const calcWeightedLength = (str) => {
        const enCount = (str.match(/[A-Za-z]/g) || []).length;
        const korCount = (str.match(/[ㄱ-ㅎㅏ-ㅣ가-힣]/g) || []).length;
        return enCount * 0.5 + korCount;
    };

    // 모달 초기화
    useEffect(() => {
        if (user) {
            setNickname(user.nickname);
            setError("");
        }
    }, [user]);

    const handleChange = (e) => {
        const value = e.target.value;
        // 허용된 문자만
        if (!validRegex.test(value)) {
            setError("한글 및 영문만 입력 가능합니다.");
            return;
        }
        // 길이 제한
        const len = calcWeightedLength(value);
        if (len > 6) {
            setError("최대 6글자(영문 0.5, 한글 1)까지만 입력 가능합니다.");
            return;
        }
        setNickname(value);
        setError("");
    };

    const handleSave = () => {
        if (!nickname.trim()) {
            setError("닉네임을 입력해주세요.");
            return;
        }
        fetch("/api/profile", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ nickname }),
        })
            .then(async (res) => {
                const text = await res.text();
                if (!res.ok) {
                    throw new Error(text || "닉네임 변경에 실패했습니다.");
                }
                return JSON.parse(text);
            })
            .then((updatedUser) => {
                onClose(updatedUser);
                alert("닉네임이 변경되었습니다.");
            })
            .catch((err) => {
                setError(err.message);
            });
    };

    const handleLogout = () => {
        fetch("/logout", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }).finally(() => {
            window.location.href = "/";
        });
    };

    return (
        <div className="profile-modal-overlay" onClick={() => onClose()}>
            <div
                className="profile-modal-content"
                onClick={(e) => e.stopPropagation()}
            >
                <button className="modal-close" onClick={() => onClose()}>X</button>
                <h2>프로필 수정</h2>

                <label>닉네임</label>
                <input type="text" value={nickname} onChange={handleChange} />
                {error && <div className="error-text" style={{ marginTop: "10px",color:"red" }}>{error}</div>}
                <div className="error-text" style={{marginTop:"10px"}}>
                    최대 6글자(영문 0.5, 한글 1)까지만 입력 가능합니다.
                </div>
                <div className="error-text">
                    일주일에 한 번 닉네임을 변경할 수 있습니다.
                </div>

                <div className="profile-modal-actions">
                    <button onClick={handleSave} disabled={!!error}>저장</button>
                    <button onClick={() => onClose()}>취소</button>
                </div>

                <div className="logout-section">
                    <button className="logout-button" onClick={handleLogout}>
                        로그아웃
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProfileModal;
