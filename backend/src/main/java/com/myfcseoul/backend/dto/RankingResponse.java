package com.myfcseoul.backend.dto;

import java.util.List;

/**
 * 랭킹 조회 결과를 클라이언트에 반환하기 위한 DTO
 */
public class RankingResponse {

    private List<AttendanceRankDTO> attendanceKings;
    private List<WinRateRankDTO>    winFairies;    // ← 추가

    // Jackson 직렬화를 위한 기본 생성자
    public RankingResponse() {}

    // 3개 리스트 모두 초기화용 생성자
    public RankingResponse(List<AttendanceRankDTO> attendanceKings,
                           List<WinRateRankDTO>     winFairies) {
        this.attendanceKings = attendanceKings;
        this.winFairies      = winFairies;
    }

    // Getters & Setters
    public List<AttendanceRankDTO> getAttendanceKings() {
        return attendanceKings;
    }
    public void setAttendanceKings(List<AttendanceRankDTO> attendanceKings) {
        this.attendanceKings = attendanceKings;
    }

    public List<WinRateRankDTO> getWinFairies() {
        return winFairies;
    }
    public void setWinFairies(List<WinRateRankDTO> winFairies) {
        this.winFairies = winFairies;
    }

    @Override
    public String toString() {
        return "RankingResponse{" +
                "attendanceKings=" + attendanceKings +
                ", winFairies="    + winFairies    +  // ← 로깅에 포함
                '}';
    }
}
