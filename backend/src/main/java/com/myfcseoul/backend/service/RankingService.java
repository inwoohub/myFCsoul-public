package com.myfcseoul.backend.service;

import com.myfcseoul.backend.dto.AttendanceRankDTO;
import com.myfcseoul.backend.dto.CheerRankDTO;
import com.myfcseoul.backend.dto.WinRateRankDTO;
import com.myfcseoul.backend.dto.RankingResponse;
import com.myfcseoul.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RankingService {

    private final UserRepository userRepo;
    private volatile RankingResponse cache;

    @Autowired
    public RankingService(UserRepository userRepo) {
        this.userRepo = userRepo;
        refreshCache();  // 애플리케이션 시작 시에도 즉시 캐싱
    }

    @Scheduled(cron = "0 0 0 * * *", zone = "Asia/Seoul")
    public void refreshCache() {
        var top5 = PageRequest.of(0, 5);
        List<AttendanceRankDTO> attends = userRepo.findTopAttendance(top5);
        List<WinRateRankDTO>     wins    = userRepo.findTopWinRate(top5);

        cache = new RankingResponse(attends, wins);
    }

    public RankingResponse getCachedRanking() {
        if (cache == null) {
            refreshCache();
        }
        return cache;
    }
}
