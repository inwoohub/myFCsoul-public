package com.myfcseoul.backend.model;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "Schedule")
public class Schedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "schedule_id")
    private Long scheduleId;

    @Column(name = "match_date", nullable = false)
    private LocalDate matchDate;

    @Column(name = "match_time", nullable = false)
    private LocalTime matchTime;

    @Column(name = "home_team", nullable = false)
    private String homeTeam;

    @Column(name = "away_team", nullable = false)
    private String awayTeam;

    @Column(name = "score_home")
    private Integer scoreHome; // 경기 전이면 NULL

    @Column(name = "score_away")
    private Integer scoreAway; // 경기 전이면 NULL

    /**
     * 결과(Enum) : '승', '무', '패' (FC서울 기준 결과)
     * 편의상 String 또는 Enum으로 처리 가능. 여기서는 String으로 처리
     */
    @Column(name = "result")
    private String result;

    @Column(name = "location")
    private String location;

    // 기본 생성자
    public Schedule() {}

    // Getters and Setters
    public Long getScheduleId() {
        return scheduleId;
    }
    public void setScheduleId(Long scheduleId) {
        this.scheduleId = scheduleId;
    }
    public LocalDate getMatchDate() {
        return matchDate;
    }
    public void setMatchDate(LocalDate matchDate) {
        this.matchDate = matchDate;
    }
    public LocalTime getMatchTime() {
        return matchTime;
    }
    public void setMatchTime(LocalTime matchTime) {
        this.matchTime = matchTime;
    }
    public String getHomeTeam() {
        return homeTeam;
    }
    public void setHomeTeam(String homeTeam) {
        this.homeTeam = homeTeam;
    }
    public String getAwayTeam() {
        return awayTeam;
    }
    public void setAwayTeam(String awayTeam) {
        this.awayTeam = awayTeam;
    }
    public Integer getScoreHome() {
        return scoreHome;
    }
    public void setScoreHome(Integer scoreHome) {
        this.scoreHome = scoreHome;
    }
    public Integer getScoreAway() {
        return scoreAway;
    }
    public void setScoreAway(Integer scoreAway) {
        this.scoreAway = scoreAway;
    }
    public String getResult() {
        return result;
    }
    public void setResult(String result) {
        this.result = result;
    }
    public String getLocation() {
        return location;
    }
    public void setLocation(String location) {
        this.location = location;
    }
}
