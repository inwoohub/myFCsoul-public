// com/myfcseoul/backend/service/ScheduleService.java
package com.myfcseoul.backend.service;

import com.myfcseoul.backend.model.Schedule;
import com.myfcseoul.backend.repository.ScheduleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class ScheduleService {

    private final ScheduleRepository scheduleRepo;

    public ScheduleService(ScheduleRepository scheduleRepo) {
        this.scheduleRepo = scheduleRepo;
    }

    /** 오늘 기준 다음 FC서울 경기 하나를, 시간까지 고려해 조회 */
    public Schedule getNextMatch() {
        LocalDate today = LocalDate.now();
        LocalTime now   = LocalTime.now();

        // 1) 오늘 남은 경기 우선 조회
        Optional<Schedule> todayMatch = scheduleRepo
                .findFirstByMatchDateAndMatchTimeGreaterThanEqualOrderByMatchTimeAsc(today, now);

        // 2) 오늘 남은 경기가 없으면 내일 이후 경기 조회
        return todayMatch
                .or(() -> scheduleRepo.findFirstByMatchDateGreaterThanOrderByMatchDateAscMatchTimeAsc(today))
                .orElse(null);
    }
}
