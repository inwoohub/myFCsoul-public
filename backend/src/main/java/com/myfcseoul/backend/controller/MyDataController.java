package com.myfcseoul.backend.controller;

import com.myfcseoul.backend.model.MyData;
import com.myfcseoul.backend.model.Schedule;
import com.myfcseoul.backend.model.User;
import com.myfcseoul.backend.repository.MyDataRepository;
import com.myfcseoul.backend.repository.ScheduleRepository;
import com.myfcseoul.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/mydata")
public class MyDataController {

    @Autowired
    private MyDataRepository myDataRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ScheduleRepository scheduleRepository;

    /**
     * 출석 사진 제출 (제출 대기 상태로 저장)
     * @param dto scheduleId와 S3 photoKey
     */
    @PostMapping("/submit")
    public ResponseEntity<?> submitAttendance(@RequestBody SubmitDto dto, Principal principal) {
        User user = userRepository.findByUserId(principal.getName())
                .orElse(null);
        if (user == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        Optional<Schedule> scheduleOpt = scheduleRepository.findById(dto.getScheduleId());
        if (scheduleOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Schedule not found.");
        }
        Schedule schedule = scheduleOpt.get();

        MyData data = myDataRepository.findByUserAndSchedule(user, schedule)
                .orElseGet(() -> {
                    MyData m = new MyData();
                    m.setUser(user);
                    m.setSchedule(schedule);
                    return m;
                });

        data.setPhotoKey(dto.getPhotoKey());
        data.setAttended(0); // 0: 제출 대기
        myDataRepository.save(data);

        return ResponseEntity.ok(Collections.singletonMap("message", "출석 사진이 제출되었습니다. 승인 대기 중입니다."));
    }

    /**
     * 사용자의 모든 출석 데이터 조회
     */
    @GetMapping
    public ResponseEntity<?> getMyData(Principal principal) {
        User user = userRepository.findByUserId(principal.getName())
                .orElse(null);
        if (user == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        List<MyData> myDataList = myDataRepository.findByUser(user);
        return ResponseEntity.ok(myDataList);
    }

    /**
     * 출석 제출용 DTO
     */
    public static class SubmitDto {
        private Long scheduleId;
        private String photoKey;

        public Long getScheduleId() {
            return scheduleId;
        }
        public void setScheduleId(Long scheduleId) {
            this.scheduleId = scheduleId;
        }
        public String getPhotoKey() {
            return photoKey;
        }
        public void setPhotoKey(String photoKey) {
            this.photoKey = photoKey;
        }
    }
}