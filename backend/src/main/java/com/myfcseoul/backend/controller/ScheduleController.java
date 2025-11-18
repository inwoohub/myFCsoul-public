package com.myfcseoul.backend.controller;
import java.util.List;
import com.myfcseoul.backend.model.Schedule;
import com.myfcseoul.backend.repository.ScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class ScheduleController {

    private final ScheduleRepository scheduleRepository;

    @Autowired
    public ScheduleController(ScheduleRepository scheduleRepository) {
        this.scheduleRepository = scheduleRepository;
    }

    // 일정 등록 API
    @PostMapping("/schedule")
    public ResponseEntity<Schedule> createSchedule(@RequestBody Schedule schedule) {
        // schedule 객체에는 프론트엔드로부터 매치 날짜(matchDate), 시간(matchTime),
        // 홈팀(homeTeam), 어웨이팀(awayTeam), 그리고 경기장(location) 값이 포함되어 있다.
        Schedule savedSchedule = scheduleRepository.save(schedule);
        return ResponseEntity.ok(savedSchedule);
    }

    // GET 방식: 전체 일정 목록 조회
    @GetMapping("/schedule")
    public ResponseEntity<List<Schedule>> getAllSchedules() {
        List<Schedule> schedules = scheduleRepository.findAll();
        return ResponseEntity.ok(schedules);
    }

    @DeleteMapping("/schedule/{id}")
    public ResponseEntity<Void> deleteSchedule(@PathVariable("id") Long scheduleId) {
        scheduleRepository.deleteById(scheduleId);
        return ResponseEntity.noContent().build();
    }
}
