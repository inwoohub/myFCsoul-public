// import React, { useState, useEffect } from "react";
// import { createPortal } from "react-dom";
// import "../css/NavigationBar.css";
// import LoginModal from "./LoginModal";
// import ProfileModal from "./ProfileModal";
// import MessengerModal from "./messenger/MessengerModal";
// import { useNavigate } from "react-router-dom";
//
// function NavigationBar() {
//     const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//     const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
//     const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
//     const [isMessengerOpen, setIsMessengerOpen] = useState(false);
//     const [user, setUser] = useState(null);
//     const navigate = useNavigate();
//
//     useEffect(() => {
//         fetch("/api/user", { credentials: "include" })
//             .then((res) => res.ok ? res.json() : Promise.reject("사용자 정보 불러오기 실패"))
//             .then((data) => setUser(data))
//             .catch(console.error);
//     }, []);
//
//     const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
//     const openLoginModal = () => setIsLoginModalOpen(true);
//     const closeLoginModal = () => setIsLoginModalOpen(false);
//     const closeProfileModal = (updated) => {
//         setIsProfileModalOpen(false);
//         if (updated) setUser(updated);
//     };
//     const handleSignClick = () => {
//         user ? setIsProfileModalOpen(true) : openLoginModal();
//     };
//
//     const openMessenger = () => setIsMessengerOpen(true);
//     const closeMessenger = () => setIsMessengerOpen(false);
//
//     return (
//         <>
//             <header className="NavigationBar">
//                 <div className="LogoTitle" onClick={() => navigate("/")}>
//                     <img
//                         className="Navigation_logoimage"
//                         alt="seoul_logo"
//                         src="/seoul_logo.png"
//                         style={{ cursor: "pointer" }}
//                     />
//                     <span className="Navigation_title">myFCseoul</span>
//                 </div>
//
//                 {/* 데스크탑 네비게이션 */}
//                 <nav className="Navigation_nav">
//                     <ul>
//                         <li onClick={() => navigate("/schedule")}>직관 등록</li>
//                         <li onClick={() => navigate(`/diary/${user?.userId ?? ""}`)}>다이어리</li>
//                         <li onClick={() => navigate("/StatisticsPage")}>Ai 경기 분석</li>
//
//                         {/* 관리자용 메뉴: role === 'admin'인 경우에만 */}
//                         {user?.role === "admin" && (
//                             <li onClick={() => navigate("/admin/attendance")}>
//                                 출석 요청 관리
//                             </li>
//                         )}
//                     </ul>
//                 </nav>
//
//                 {/* 로그인한 경우에만 메신저(친구 목록) 노출 */}
//                 {user && (
//                     <li className="Navigation_frined" onClick={openMessenger} style={{ cursor: "pointer" }}>친구 목록</li>
//                 )}
//
//                 {/* 로그인 / 프로필 */}
//                 <span className="Navigation_sign" onClick={handleSignClick}>
//                   {user ? `마이페이지` : "로그인/회원가입"}
//                 </span>
//
//                 {/* 햄버거 (모바일) */}
//                 <button className="Hamburger" onClick={toggleMobileMenu}>
//                     ☰
//                 </button>
//
//                 {/* 로그인 모달 */}
//                 {isLoginModalOpen && <LoginModal onClose={closeLoginModal} />}
//
//                 {/* 프로필 모달 */}
//                 {isProfileModalOpen && (
//                     <ProfileModal user={user} onClose={closeProfileModal} />
//                 )}
//                 {/* 메신저 모달 */}
//                 {isMessengerOpen && (
//                     <MessengerModal
//                         isOpen={isMessengerOpen}
//                         onClose={closeMessenger}
//                         user={user}      // ← 여기에 user 또는 user.userId 등 원하는 값을 넘겨줍니다.
//                     />
//                 )}
//             </header>
//
//             {/* 모바일 메뉴 (Portal) */}
//             {isMobileMenuOpen &&
//                 createPortal(
//                     // 1) overlay: 화면 전체를 덮는 div
//                     <div
//                         className="Mobile_nav_overlay"
//                         onClick={() => setIsMobileMenuOpen(false)}
//                     >
//                         {/* 2) 실제 메뉴 영역: 클릭 이벤트가 버블되지 않도록 stopPropagation */}
//                         <nav
//                             className="Mobile_nav"
//                             onClick={(e) => e.stopPropagation()}
//                         >
//                             <div className="Mobile_nav_header" onClick={handleSignClick}>
//                                 {user ? `마이페이지` : "로그인/회원가입"}
//                             </div>
//                             <ul>
//                                 <li onClick={() => { navigate("/schedule"); setIsMobileMenuOpen(false); }}>
//                                     직관 등록
//                                 </li>
//                                 <li onClick={() => { navigate(`/diary/${user?.userId ?? ""}`); setIsMobileMenuOpen(false); }}>
//                                     다이어리
//                                 </li>
//                                 <li onClick={() => { navigate("/StatisticsPage"); setIsMobileMenuOpen(false); }}>
//                                     Ai 경기 분석
//                                 </li>
//
//                                 {user && (
//                                     <li
//                                         onClick={() => {
//                                             openMessenger();           // 모달 열기
//                                             setIsMobileMenuOpen(false); // 햄버거 메뉴 닫기
//                                         }}
//                                     >
//                                         친구 목록
//                                     </li>
//                                 )}
//
//                                 {/* 모바일용 관리자 메뉴 */}
//                                 {user?.role === "admin" && (
//                                     <li onClick={() => { navigate("/admin/attendance"); setIsMobileMenuOpen(false); }}>
//                                         출석 요청 관리
//                                     </li>
//                                 )}
//                             </ul>
//                         </nav>
//                     </div>,
//                     document.getElementById("mobile-menu-root")
//                 )}
//         </>
//     );
// }
//
// export default NavigationBar;

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import "../css/NavigationBar.css";
import LoginModal from "./LoginModal";
import ProfileModal from "./ProfileModal";
import AdminUserModal from "./AdminUserModal";
import MessengerModal from "./messenger/MessengerModal";
import InitialNicknameModal from "./InitialNicknameModal";
import { useNavigate } from "react-router-dom";

function NavigationBar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isMessengerOpen, setIsMessengerOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [isInitModalOpen, setIsInitModalOpen] = useState(false);
    const navigate = useNavigate();
    const [isAdminUserModalOpen, setIsAdminUserModalOpen] = useState(false);

    useEffect(() => {
        fetch("/api/user", { credentials: "include" })
            .then(res => (res.ok ? res.json() : Promise.reject()))
            .then(data => {
                setUser(data);
                if (data.nickname === "Unknown") {
                    setIsInitModalOpen(true);
                }
            })
            .catch(console.error);
    }, []);

    const handleInitialSave = nickname => {
        fetch("/api/profile", {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nickname }),   // ①
        })
            .then(res => {
                if (!res.ok) {
                    return res.text().then(text => Promise.reject(text));
                }
                return res.json();                  // ②
            })
            .then(updatedUser => {
                // 서버가 반환해 준 User 객체로 상태 업데이트
                setUser(updatedUser);
                setIsInitModalOpen(false);
            })
            .catch(err => {
                // err: 에러 메시지(일주일 제한·중복 등)
                alert(typeof err === "string" ? err : "닉네임 설정에 실패했습니다.");
            });
    };

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const openLoginModal = () => setIsLoginModalOpen(true);
    const closeLoginModal = () => setIsLoginModalOpen(false);
    const closeProfileModal = (updated) => {
        setIsProfileModalOpen(false);
        if (updated) setUser(updated);
    };
    const handleSignClick = () => {
        user ? setIsProfileModalOpen(true) : openLoginModal();
    };

    const openMessenger = () => setIsMessengerOpen(true);
    const closeMessenger = () => setIsMessengerOpen(false);

    return (
        <>
            <header className="NavigationBar">
                <div className="LogoTitle" onClick={() => navigate("/")}>
                    <img
                        className="Navigation_logoimage"
                        alt="seoul_logo"
                        src="/seoul_logo.png"
                        style={{ cursor: "pointer" }}
                    />
                    <span className="Navigation_title">myFCseoul</span>
                </div>

                {/* 데스크탑 네비게이션 */}
                <nav className="Navigation_nav">
                    <ul>
                        <li onClick={() => navigate("/schedule")}>직관 등록</li>
                        <li onClick={() => navigate(`/diary/${user?.userId ?? ""}`)}>다이어리</li>
                        <li onClick={() => navigate("/StatisticsPage")}>Ai 경기 분석</li>

                        {/* 관리자용 메뉴: role === 'admin'인 경우에만 */}
                        {user?.role === "admin" && (
                            <li onClick={() => navigate("/admin/attendance")}>
                                출석 요청 관리
                            </li>
                        )}
                        {user?.role === "admin" && (
                            <li onClick={() => setIsAdminUserModalOpen(true)}>
                                사용자 관리
                            </li>
                        )}
                    </ul>

                </nav>

                {/* 로그인한 경우에만 메신저(친구 목록) 노출 */}
                {user && (
                    <li className="Navigation_frined" onClick={openMessenger} style={{ cursor: "pointer" }}>친구 목록</li>
                )}

                {/* 로그인 / 프로필 */}
                <span className="Navigation_sign" onClick={handleSignClick}>
                  {user ? `마이페이지` : "로그인/회원가입"}
                </span>

                {/* 햄버거 (모바일) */}
                <button className="Hamburger" onClick={toggleMobileMenu}>
                    ☰
                </button>

                {/* 로그인 모달 */}
                {isLoginModalOpen && <LoginModal onClose={closeLoginModal} />}

                {/* 프로필 모달 */}
                {isProfileModalOpen && (
                    <ProfileModal user={user} onClose={closeProfileModal} />
                )}
                {/* 메신저 모달 */}
                {isMessengerOpen && (
                    <MessengerModal
                        isOpen={isMessengerOpen}
                        onClose={closeMessenger}
                        user={user}      // ← 여기에 user 또는 user.userId 등 원하는 값을 넘겨줍니다.
                    />
                )}
            </header>

            {isInitModalOpen && (
                <InitialNicknameModal onSave={handleInitialSave} />
            )}

            {/* ★ 관리자 전용: 사용자 관리 모달 렌더 */}
            {user?.role === "admin" && (
                <AdminUserModal
                    open={isAdminUserModalOpen}
                    onClose={() => setIsAdminUserModalOpen(false)}
                />
            )}

            {/* 모바일 메뉴 (Portal) */}
            {isMobileMenuOpen &&
                createPortal(
                    // 1) overlay: 화면 전체를 덮는 div
                    <div
                        className="Mobile_nav_overlay"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        {/* 2) 실제 메뉴 영역: 클릭 이벤트가 버블되지 않도록 stopPropagation */}
                        <nav
                            className="Mobile_nav"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="Mobile_nav_header" onClick={handleSignClick}>
                                {user ? `마이페이지` : "로그인/회원가입"}
                            </div>
                            <ul>
                                <li onClick={() => { navigate("/schedule"); setIsMobileMenuOpen(false); }}>
                                    직관 등록
                                </li>
                                <li onClick={() => { navigate(`/diary/${user?.userId ?? ""}`); setIsMobileMenuOpen(false); }}>
                                    다이어리
                                </li>
                                <li onClick={() => { navigate("/StatisticsPage"); setIsMobileMenuOpen(false); }}>
                                    Ai 경기 분석
                                </li>

                                {user && (
                                    <li
                                        onClick={() => {
                                            openMessenger();           // 모달 열기
                                            setIsMobileMenuOpen(false); // 햄버거 메뉴 닫기
                                        }}
                                    >
                                        친구 목록
                                    </li>
                                )}
                                <li className="NavigationBarItem">
                                    <a
                                        href="https://www.fcseoul.com/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        🏠 FC서울 공식 홈페이지
                                    </a>
                                </li>
                                <li className="NavigationBarItem">
                                    <a
                                        href="https://www.instagram.com/fcseoul/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        📸 FC서울 인스타그램
                                    </a>
                                </li>
                                <li className="NavigationBarItem">
                                    <a
                                        href="https://www.fcseoul.com/tickets/reserveSingleTicket"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        🎫 FC서울 예매하기
                                    </a>
                                </li>
                                <li className="NavigationBarItem">
                                    <a
                                        href="https://fcseoulite.me/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        🤝 서울라이트
                                    </a>
                                </li>

                                {/* 모바일용 관리자 메뉴 */}
                                {user?.role === "admin" && (
                                    <li onClick={() => { navigate("/admin/attendance"); setIsMobileMenuOpen(false); }}>
                                        출석 요청 관리
                                    </li>
                                )}
                                {user?.role === "admin" && (
                                    <li onClick={() => { setIsAdminUserModalOpen(true); setIsMobileMenuOpen(false); }}>
                                        사용자 관리
                                    </li>
                                )}
                            </ul>
                        </nav>
                    </div>,
                    document.getElementById("mobile-menu-root")
                )}
        </>
    );
}

export default NavigationBar;
