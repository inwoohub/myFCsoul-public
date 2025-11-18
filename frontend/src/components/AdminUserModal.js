import React, { useEffect, useMemo, useState } from "react";

const PAGE_SIZE = 20;

export default function AdminUserModal({ open, onClose }) {
    const [users, setUsers] = useState([]);
    const [totalElements, setTotalElements] = useState(0);
    const [page, setPage] = useState(0);
    const [keyword, setKeyword] = useState("");
    const [loading, setLoading] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const totalPages = useMemo(() => Math.ceil(totalElements / PAGE_SIZE), [totalElements]);

    // 화면폭 감지: 640px 이하면 모바일
    useEffect(() => {
        const mq = window.matchMedia("(max-width: 640px)");
        const handler = (e) => setIsMobile(e.matches);
        setIsMobile(mq.matches);
        // 브라우저 호환
        if (mq.addEventListener) mq.addEventListener("change", handler);
        else mq.addListener(handler);
        return () => {
            if (mq.removeEventListener) mq.removeEventListener("change", handler);
            else mq.removeListener(handler);
        };
    }, []);

    useEffect(() => {
        if (!open) return;
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const params = new URLSearchParams({
                    page: String(page),
                    size: String(PAGE_SIZE),
                    keyword: keyword.trim(),
                    sort: "createdAt,desc",
                });
                const res = await fetch(`/api/admin/users?${params.toString()}`, {
                    credentials: "include",
                });
                if (!res.ok) throw new Error("사용자 목록을 불러오지 못했습니다.");
                const data = await res.json();
                setUsers(data.content || []);
                setTotalElements(data.totalElements ?? 0);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [open, page, keyword]);

    const resetAndSearch = () => setPage(0);

    if (!open) return null;

    return (
        <div className="AdminUserModal__overlay" onClick={onClose}>
            <div className="AdminUserModal__content" onClick={(e) => e.stopPropagation()}>
                <div className="AdminUserModal__header">
                    <h3>사용자 관리</h3>
                    <button className="AdminUserModal__close" onClick={onClose} aria-label="닫기">×</button>
                </div>

                <div className="AdminUserModal__toolbar">
                    <div className="AdminUserModal__stats">
                        전체 사용자: <b>{totalElements.toLocaleString()}</b>명
                    </div>
                    <div className="AdminUserModal__search">
                        <input
                            type="text"
                            placeholder="닉네임/아이디 검색"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && resetAndSearch()}
                        />
                        <button className="tap" onClick={resetAndSearch}>검색</button>
                    </div>
                </div>

                {/* 데스크탑: 테이블 보기 */}
                {!isMobile && (
                    <div className="AdminUserModal__tableWrap">
                        <table className="AdminUserModal__table">
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>닉네임</th>
                                <th>아이디</th>
                                <th>역할</th>
                                <th>가입일</th>
                                <th>닉변일</th>
                            </tr>
                            </thead>
                            <tbody>
                            {loading ? (
                                <tr><td colSpan={6} style={{ textAlign: "center" }}>불러오는 중…</td></tr>
                            ) : users.length === 0 ? (
                                <tr><td colSpan={6} style={{ textAlign: "center" }}>데이터가 없습니다.</td></tr>
                            ) : (
                                users.map((u, idx) => (
                                    <tr key={u.userId}>
                                        <td>{page * PAGE_SIZE + idx + 1}</td>
                                        <td>{u.nickname}</td>
                                        <td>{u.userId}</td>
                                        <td>{u.role}</td>
                                        <td>{u.createdAt ? u.createdAt.replace("T", " ").slice(0, 19) : "-"}</td>
                                        <td>{u.lastNicknameUpdate ? u.lastNicknameUpdate.replace("T", " ").slice(0, 19) : "-"}</td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* 모바일: 카드 보기 */}
                {isMobile && (
                    <div className="AdminUserModal__cards">
                        {loading && <div className="AdminUserModal__empty">불러오는 중…</div>}
                        {!loading && users.length === 0 && (
                            <div className="AdminUserModal__empty">데이터가 없습니다.</div>
                        )}
                        {!loading && users.map((u, idx) => (
                            <div className="AdminUserModal__card" key={u.userId}>
                                <div className="AdminUserModal__cardTop">
                                    <div className="AdminUserModal__badge">{page * PAGE_SIZE + idx + 1}</div>
                                    <div className="AdminUserModal__role">{u.role}</div>
                                </div>
                                <div className="AdminUserModal__row">
                                    <span className="label">닉네임</span>
                                    <span className="value">{u.nickname}</span>
                                </div>
                                <div className="AdminUserModal__row">
                                    <span className="label">아이디</span>
                                    <span className="value mono">{u.userId}</span>
                                </div>
                                <div className="AdminUserModal__row">
                                    <span className="label">가입일</span>
                                    <span className="value">{u.createdAt ? u.createdAt.replace("T", " ").slice(0, 19) : "-"}</span>
                                </div>
                                <div className="AdminUserModal__row">
                                    <span className="label">닉변일</span>
                                    <span className="value">{u.lastNicknameUpdate ? u.lastNicknameUpdate.replace("T", " ").slice(0, 19) : "-"}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="AdminUserModal__pager">
                    <button className="tap" disabled={page <= 0} onClick={() => setPage((p) => p - 1)}>이전</button>
                    <span>{page + 1} / {Math.max(totalPages, 1)}</span>
                    <button className="tap" disabled={page + 1 >= totalPages} onClick={() => setPage((p) => p + 1)}>다음</button>
                </div>
            </div>
        </div>
    );
}