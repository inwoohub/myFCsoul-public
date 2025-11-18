//package com.myfcseoul.backend.repository;
//
//// MyDataRepository.java
//import com.myfcseoul.backend.model.Schedule;
//import com.myfcseoul.backend.model.MyData;
//import com.myfcseoul.backend.model.User;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.stereotype.Repository;
//import java.util.List;
//import java.util.Optional;
//
//@Repository
//public interface MyDataRepository extends JpaRepository<MyData, Long> {
//    List<MyData> findByUser(User user);
//
//    // 특정 사용자와 경기(Schedule)에 해당하는 MyData를 찾는 메서드
//    Optional<MyData> findByUserAndSchedule(User user, Schedule schedule);
//
//    List<MyData> findAllByUserUserIdAndAttended(String userId, Integer attended);
//}


package com.myfcseoul.backend.repository;

import com.myfcseoul.backend.model.MyData;
import com.myfcseoul.backend.model.Schedule;
import com.myfcseoul.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MyDataRepository extends JpaRepository<MyData, Long> {
    /**
     * 사용자의 모든 출석 데이터 조회
     */
    List<MyData> findByUser(User user);

    /**
     * 특정 사용자와 일정에 해당하는 출석 데이터 조회
     */
    Optional<MyData> findByUserAndSchedule(User user, Schedule schedule);

    /**
     * 사용자 아이디로 모든 출석 데이터 조회
     */
    List<MyData> findByUserUserId(String userId);

    /**
     * 사용자 아이디와 attended 값으로 필터링 (예: 1=승인된 출석)
     */
    List<MyData> findByUserUserIdAndAttended(String userId, Integer attended);

    List<MyData> findByAttended(Integer attended);
}
