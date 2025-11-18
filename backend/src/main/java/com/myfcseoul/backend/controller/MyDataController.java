//package com.myfcseoul.backend.controller;
//
//import com.myfcseoul.backend.model.MyData;
//import com.myfcseoul.backend.model.Schedule;
//import com.myfcseoul.backend.model.User;
//import com.myfcseoul.backend.repository.MyDataRepository;
//import com.myfcseoul.backend.repository.ScheduleRepository;
//import com.myfcseoul.backend.repository.UserRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.Collections;
//import java.security.Principal;
//import java.util.Optional;
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/mydata")
//public class MyDataController {
//
//    @Autowired
//    private MyDataRepository myDataRepository;
//
//    @Autowired
//    private UserRepository userRepository;
//
//    @Autowired
//    private ScheduleRepository scheduleRepository;
//
//    /**
//     * 클라이언트에서 전달한 출석(직관) 정보를 저장 또는 업데이트합니다.
//     * 기존에 동일한 사용자와 경기의 MyData가 있는 경우 update,
//     * 없으면 새로 생성합니다.
//     *
//     * @param request 클라이언트가 전송하는 JSON 데이터 (scheduleId, attended)
//     * @param principal 현재 로그인한 사용자의 정보를 포함합니다.
//     * @return 저장 또는 업데이트 처리 결과 (JSON 형태)
//     */
//    @PostMapping
//    public ResponseEntity<?> saveMyData(@RequestBody MyDataRequest request, Principal principal) {
//        // 현재 로그인한 사용자 정보를 가져옴 (카카오 고유 ID 사용)
//        User user = userRepository.findByUserId(principal.getName()).orElse(null);
//        if (user == null) {
//            return ResponseEntity.status(401).body("Unauthorized");
//        }
//
//        // 전달받은 scheduleId에 해당하는 Schedule 엔티티 조회
//        Optional<Schedule> optionalSchedule = scheduleRepository.findById(request.getScheduleId());
//        if (!optionalSchedule.isPresent()) {
//            return ResponseEntity.badRequest().body("Schedule not found.");
//        }
//        Schedule schedule = optionalSchedule.get();
//
//        // 같은 사용자와 스케줄에 해당하는 MyData가 이미 존재하는지 확인
//        Optional<MyData> existingDataOpt = myDataRepository.findByUserAndSchedule(user, schedule);
//        MyData myData;
//        String message;
//        if (existingDataOpt.isPresent()) {
//            // 기존 데이터가 있으면 업데이트
//            myData = existingDataOpt.get();
//            myData.setAttended(request.getAttended());
//            message = "Attendance updated successfully.";
//        } else {
//            // 없으면 새로 생성
//            myData = new MyData();
//            myData.setUser(user);
//            myData.setSchedule(schedule);
//            myData.setAttended(request.getAttended());
//            message = "Attendance saved successfully.";
//        }
//
//        // DB에 저장 (저장 시, update 및 새로 생성 모두 처리됨)
//        myDataRepository.save(myData);
//
//        return ResponseEntity.ok(Collections.singletonMap("message", message));
//    }
//
//    /**
//     * 현재 로그인한 사용자의 출석(직관) 상태를 조회하는 엔드포인트입니다.
//     * @param principal 현재 로그인한 사용자 정보를 포함합니다.
//     * @return 사용자의 출석 정보 목록 (JSON 배열)
//     */
//    @GetMapping
//    public ResponseEntity<?> getMyData(Principal principal) {
//        // 현재 로그인한 사용자 정보를 가져옴 (카카오 고유 ID 사용)
//        User user = userRepository.findByUserId(principal.getName()).orElse(null);
//        if (user == null) {
//            return ResponseEntity.status(401).body("Unauthorized");
//        }
//        // 사용자에 해당하는 MyData 목록 조회
//        List<MyData> myDataList = myDataRepository.findByUser(user);
//        return ResponseEntity.ok(myDataList);
//    }
//
//    // 클라이언트로부터 전달받을 데이터를 위한 DTO 클래스
//    public static class MyDataRequest {
//        private Long scheduleId;
//        private Integer attended;
//
//        public Long getScheduleId() {
//            return scheduleId;
//        }
//        public void setScheduleId(Long scheduleId) {
//            this.scheduleId = scheduleId;
//        }
//        public Integer getAttended() {
//            return attended;
//        }
//        public void setAttended(Integer attended) {
//            this.attended = attended;
//        }
//    }
//}

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