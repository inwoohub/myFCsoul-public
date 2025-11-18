package com.myfcseoul.backend.dto;

import java.util.List;

/**
 * 랭킹 조회 결과를 클라이언트에 반환하기 위한 DTO
 */
public class RankingResponse {

    private List<AttendanceRankDTO> attendanceKings;
    private List<CheerRankDTO>      cheerFairies;
    private List<WinRateRankDTO>    winFairies;    // ← 추가

    // Jackson 직렬화를 위한 기본 생성자
    public RankingResponse() {}

    // 기존 생성자 (필요 없으면 지워도 됩니다)
    public RankingResponse(List<AttendanceRankDTO> attendanceKings,
                           List<CheerRankDTO>       cheerFairies) {
        this.attendanceKings = attendanceKings;
        this.cheerFairies    = cheerFairies;
    }

    // 3개 리스트 모두 초기화용 생성자
    public RankingResponse(List<AttendanceRankDTO> attendanceKings,
                           List<CheerRankDTO>       cheerFairies,
                           List<WinRateRankDTO>     winFairies) {
        this.attendanceKings = attendanceKings;
        this.cheerFairies    = cheerFairies;
        this.winFairies      = winFairies;
    }

    // Getters & Setters
    public List<AttendanceRankDTO> getAttendanceKings() {
        return attendanceKings;
    }
    public void setAttendanceKings(List<AttendanceRankDTO> attendanceKings) {
        this.attendanceKings = attendanceKings;
    }

    public List<CheerRankDTO> getCheerFairies() {
        return cheerFairies;
    }
    public void setCheerFairies(List<CheerRankDTO> cheerFairies) {
        this.cheerFairies = cheerFairies;
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
                ", cheerFairies="  + cheerFairies  +
                ", winFairies="    + winFairies    +  // ← 로깅에 포함
                '}';
    }
}
