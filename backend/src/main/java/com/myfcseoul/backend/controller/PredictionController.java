package com.myfcseoul.backend.controller;

import com.myfcseoul.backend.model.MyData;
import com.myfcseoul.backend.model.Schedule;
import com.myfcseoul.backend.model.User;
import com.myfcseoul.backend.repository.UserRepository;
import com.myfcseoul.backend.service.KLeagueScraperService;
import com.myfcseoul.backend.service.MyDataService;
import com.myfcseoul.backend.service.ScheduleService;
import com.myfcseoul.backend.service.OpenAiClientService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class PredictionController {

    private static final Logger log = LoggerFactory.getLogger(PredictionController.class);

    private final MyDataService myDataService;
    private final KLeagueScraperService scraper;
    private final ScheduleService scheduleService;
    private final OpenAiClientService ai;
    private final UserRepository userRepo;

    public PredictionController(
            MyDataService myDataService,
            KLeagueScraperService scraper,
            ScheduleService scheduleService,
            OpenAiClientService ai,
            UserRepository userRepo
    ) {
        this.myDataService = myDataService;
        this.scraper = scraper;
        this.scheduleService = scheduleService;
        this.ai = ai;
        this.userRepo = userRepo;
    }

    @GetMapping("/predict")
    public ResponseEntity<?> predictGet(@RequestParam String userId) throws Exception {
        return doPredict(userId);
    }

    @PostMapping("/predict")
    public ResponseEntity<?> predictPost(@RequestParam String userId) throws Exception {
        return doPredict(userId);
    }

    private ResponseEntity<?> doPredict(String userId) throws Exception {
        // 0) 사용자 정보 조회
        User user = userRepo.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "로그인이 필요합니다."));
        }

        // 관리자(admin) 권한이면 시간 제한 없이 통과
        boolean isAdmin = "admin".equalsIgnoreCase(user.getRole());

        // 1) 마지막 예측 시각 체크 (1일 1회 제한) - 일반 사용자만
        if (!isAdmin) {
            LocalDate lastDate = user.getLastPredictionAt() != null
                    ? user.getLastPredictionAt().toLocalDate() : null;
            if (lastDate != null && lastDate.equals(LocalDate.now())) {
                long hoursLeft = Duration.between(user.getLastPredictionAt(), LocalDateTime.now()).toHours();
                return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                        .body(Map.of(
                                "error", "하루에 한 번만 예측 가능합니다.",
                                "hoursLeft", Math.max(0, 24 - hoursLeft)
                        ));
            }
        }

        // 2) 직관 데이터 가져오기 & 필터링
        List<MyData> allData = myDataService.getByUserId(userId);
        List<MyData> attendedList = allData.stream()
                .filter(d -> Integer.valueOf(1).equals(d.getAttended()))
                .collect(Collectors.toList());

        Schedule nextMatch = scheduleService.getNextMatch();
        log.info("▶▶▶ attended==1 count: {}", attendedList.size());
        log.info("▶▶▶ results (attended==1): {}",
                attendedList.stream()
                        .map(d -> d.getSchedule().getResult())
                        .collect(Collectors.joining(", "))
        );

        // 3) 현재 순위 스크랩
        List<KLeagueScraperService.Standing> standings = scraper.fetchStandings();

        // 4) AI 프롬프트 생성 및 호출
        String prompt = com.myfcseoul.backend.service.PromptBuilder.build(attendedList, standings, nextMatch);
        log.info("▶▶▶ PROMPT TO AI:\n{}", prompt);
        String prediction = ai.getPrediction(prompt);

        // 5) 마지막 예측 시각 및 결과 업데이트 (일반 사용자만)
        if (!isAdmin) {
            user.setLastPredictionAt(LocalDateTime.now());
            user.setLastPredictionResult(prediction);
            userRepo.save(user);
        }

        // 6) 예측 결과 반환
        return ResponseEntity.ok(Collections.singletonMap("prediction", prediction));
    }

    /**
     * 오늘 저장된 예측 결과 조회 (GET /api/prediction)
     */
    @GetMapping("/prediction")
    public ResponseEntity<?> getTodayPrediction(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "로그인이 필요합니다."));
        }
        String userId = principal.getName();
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));

        LocalDate lastDate = user.getLastPredictionAt() != null
                ? user.getLastPredictionAt().toLocalDate() : null;
        if (lastDate != null && lastDate.equals(LocalDate.now())
                && user.getLastPredictionResult() != null) {
            return ResponseEntity.ok(Map.of("prediction", user.getLastPredictionResult()));
        }
        return ResponseEntity.noContent().build();
    }
}