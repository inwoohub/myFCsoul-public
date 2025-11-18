// com/myfcseoul/backend/repository/ScheduleRepository.java
package com.myfcseoul.backend.repository;

import com.myfcseoul.backend.model.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

    /**
     * 오늘(matchDate == date) 중에서 현재 시각 이후(matchTime >= time)인 경기 중
     * 가장 이른 시간의 Schedule 하나를 가져온다.
     */
    Optional<Schedule> findFirstByMatchDateAndMatchTimeGreaterThanEqualOrderByMatchTimeAsc(
            LocalDate date,
            LocalTime time
    );

    /**
     * 오늘 이후(matchDate > date) 경기 중
     * 가장 빠른 날짜·시간의 Schedule 하나를 가져온다.
     */
    Optional<Schedule> findFirstByMatchDateGreaterThanOrderByMatchDateAscMatchTimeAsc(
            LocalDate date
    );
}
