package com.myfcseoul.backend.dto;

/**
 * MyData.attended = 1 건수를 projection 하기 위한 인터페이스
 */
public interface AttendanceRankDTO {
    String getNickname();        // User.nickname
    Long   getAttendanceCount(); // COUNT(md) 결과
}
