package com.myfcseoul.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "MyData")
public class MyData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "mydata_id")
    private Long mydataId;

    // 사용자와 다대일 관계
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // 경기 일정과 다대일 관계
    @ManyToOne
    @JoinColumn(name = "schedule_id", nullable = false)
    private Schedule schedule;

    /**
     * attended: 0=제출/승인 대기, 1=승인(출석 완료), 2=거절
     */
    @Column(name = "attended")
    private Integer attended;

    /** 업로드된 사진의 S3 객체 키 */
    @Column(name = "photo_key")
    private String photoKey;

    // 기본 생성자
    public MyData() {}

    // Getters and Setters
    public Long getMydataId() {
        return mydataId;
    }
    public void setMydataId(Long mydataId) {
        this.mydataId = mydataId;
    }

    public User getUser() {
        return user;
    }
    public void setUser(User user) {
        this.user = user;
    }

    public Schedule getSchedule() {
        return schedule;
    }
    public void setSchedule(Schedule schedule) {
        this.schedule = schedule;
    }

    public Integer getAttended() {
        return attended;
    }
    public void setAttended(Integer attended) {
        this.attended = attended;
    }

    public String getPhotoKey() {
        return photoKey;
    }
    public void setPhotoKey(String photoKey) {
        this.photoKey = photoKey;
    }
}


