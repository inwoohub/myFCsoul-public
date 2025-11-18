package com.myfcseoul.backend.controller;

import com.myfcseoul.backend.model.Schedule;
import com.myfcseoul.backend.repository.ScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Collections;
import java.util.Optional;

@RestController
@RequestMapping("/api/scheduleresult")
public class ScheduleResultController {

    @Autowired
    private ScheduleRepository scheduleRepository;

    /**
     * 관리자 결과 등록 API
     * 특정 경기(scheduleId)의 결과 정보를 업데이트합니다.
     * @param request 경기 결과 정보 (scoreHome, scoreAway, result 등)
     * @return 결과 업데이트 성공 메시지( JSON 형태 )
     */
    @PostMapping
    public ResponseEntity<?> updateScheduleResult(@RequestBody ScheduleResultRequest request) {
        Optional<Schedule> optionalSchedule = scheduleRepository.findById(request.getScheduleId());
        if (!optionalSchedule.isPresent()) {
            return ResponseEntity.badRequest().body("Schedule not found.");
        }
        Schedule schedule = optionalSchedule.get();

        schedule.setScoreHome(request.getScoreHome());
        schedule.setScoreAway(request.getScoreAway());
        schedule.setResult(request.getResult());
        // 필요에 따라 다른 필드도 업데이트할 수 있음

        scheduleRepository.save(schedule);

        return ResponseEntity.ok(Collections.singletonMap("message", "결과가 등록되었습니다."));
    }

    /**
     * 관리자 결과 삭제 API
     * 특정 경기(scheduleId)의 결과 정보를 삭제합니다.
     * 여기서는 결과 정보를 null로 업데이트합니다.
     * @param request 삭제할 스케줄 정보 (scheduleId)
     * @return 결과 삭제 성공 메시지 (JSON 형태)
     */
    @DeleteMapping
    public ResponseEntity<?> deleteScheduleResult(@RequestBody DeleteScheduleRequest request) {
        Optional<Schedule> optionalSchedule = scheduleRepository.findById(request.getScheduleId());
        if (!optionalSchedule.isPresent()) {
            return ResponseEntity.badRequest().body("Schedule not found.");
        }
        Schedule schedule = optionalSchedule.get();

        // 삭제는 결과 정보를 null로 세팅하여 삭제하는 방식으로 처리합니다.
        schedule.setScoreHome(null);
        schedule.setScoreAway(null);
        schedule.setResult(null);

        scheduleRepository.save(schedule);

        return ResponseEntity.ok(Collections.singletonMap("message", "결과가 삭제되었습니다."));
    }

    // 결과 등록에 사용될 DTO 클래스
    public static class ScheduleResultRequest {
        private Long scheduleId;
        private Integer scoreHome;
        private Integer scoreAway;
        /**
         * 결과는 FC서울 기준 '승', '무', '패' 중 하나의 문자열로 저장합니다.
         */
        private String result;

        public Long getScheduleId() {
            return scheduleId;
        }
        public void setScheduleId(Long scheduleId) {
            this.scheduleId = scheduleId;
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
    }

    // 결과 삭제에 사용될 DTO 클래스 (scheduleId 만 필요합니다)
    public static class DeleteScheduleRequest {
        private Long scheduleId;

        public Long getScheduleId() {
            return scheduleId;
        }
        public void setScheduleId(Long scheduleId) {
            this.scheduleId = scheduleId;
        }
    }
}
