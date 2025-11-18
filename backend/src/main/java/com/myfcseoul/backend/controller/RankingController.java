package com.myfcseoul.backend.controller;

import com.myfcseoul.backend.dto.RankingResponse;
import com.myfcseoul.backend.service.RankingService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class RankingController {

    private final RankingService rankingService;

    public RankingController(RankingService rankingService) {
        this.rankingService = rankingService;
    }

    @GetMapping("/rankings")
    public RankingResponse getRankings() {
        // 캐시된 랭킹 결과를 반환
        return rankingService.getCachedRanking();
    }
}
