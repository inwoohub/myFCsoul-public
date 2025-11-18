package com.myfcseoul.backend.dto;

public class WinRateRankDTO {
    private String nickname;
    private long attendedCount;
    private long winCount;
    private double winRate;

    public WinRateRankDTO(String nickname, long attendedCount, long winCount, double winRate) {
        this.nickname = nickname;
        this.attendedCount = attendedCount;
        this.winCount      = winCount;
        this.winRate       = winRate;
    }

    public String getNickname()      { return nickname; }
    public long getAttendedCount()   { return attendedCount; }
    public long getWinCount()        { return winCount; }
    public double getWinRate()       { return winRate; }
}
