package com.myfcseoul.backend.repository;
import org.springframework.data.domain.Page;
import com.myfcseoul.backend.dto.AttendanceRankDTO;
import com.myfcseoul.backend.dto.CheerRankDTO;
import com.myfcseoul.backend.dto.WinRateRankDTO;
import com.myfcseoul.backend.model.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    Optional<User> findByUserId(String userId);

    // 닉네임 중복 체크 (본인 제외)
    boolean existsByNickname(String nickname);
    boolean existsByNicknameAndUserIdNot(String nickname, String userId);

    // 닉네임으로 사용자 조회
    Optional<User> findByNickname(String nickname);

    // ★ 관리자 모달용: 아이디/닉네임 키워드 검색 + 페이지네이션
    Page<User> findByUserIdContainingIgnoreCaseOrNicknameContainingIgnoreCase(
            String userIdPart, String nicknamePart, Pageable pageable);

    // ★ (선택) 총원 카운트 with 키워드
    long countByUserIdContainingIgnoreCaseOrNicknameContainingIgnoreCase(
            String userIdPart, String nicknamePart);

    // 직관왕
    @Query("""
        SELECT u.nickname AS nickname,
               COUNT(md)    AS attendanceCount
          FROM MyData md
          JOIN md.user u
         WHERE md.attended = 1
         AND u.nickname <> 'Unknown'
         GROUP BY u.nickname
         ORDER BY COUNT(md) DESC
        """
    )
    List<AttendanceRankDTO> findTopAttendance(Pageable pageable);

    // 승리요정: 직관(attended=1)한 경기 중 '승' 비율 상위 N명
    @Query("""
        SELECT new com.myfcseoul.backend.dto.WinRateRankDTO(
                 u.nickname,
                 COUNT(md),
                 SUM(CASE WHEN s.result = '승' THEN 1 ELSE 0 END),
                 SUM(CASE WHEN s.result = '승' THEN 1 ELSE 0 END) * 100.0 / COUNT(md)
               )
          FROM MyData md
          JOIN md.user u
          JOIN md.schedule s
         WHERE md.attended = 1
           AND u.nickname <> 'Unknown'
           AND s.result IS NOT NULL
         GROUP BY u.nickname
         HAVING COUNT(md) > 5
         ORDER BY SUM(CASE WHEN s.result = '승' THEN 1 ELSE 0 END) * 100.0 / COUNT(md) DESC
        """
    )
    List<WinRateRankDTO> findTopWinRate(Pageable pageable);

    /**
     * 닉네임 및 마지막 변경 시각만 업데이트
     * @return 변경된 행(row) 수
     */
    @Modifying(clearAutomatically = true)
    @Transactional
    @Query("""
        UPDATE User u
           SET u.nickname            = :nickname,
               u.lastNicknameUpdate = :now
         WHERE u.userId = :userId
    """
    )
    int updateNicknameOnly(
            @Param("userId")   String userId,
            @Param("nickname") String nickname,
            @Param("now")      LocalDateTime now
    );


}
