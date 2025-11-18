package com.myfcseoul.backend.service;

import com.myfcseoul.backend.model.MyData;
import com.myfcseoul.backend.model.Schedule;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import static java.util.Map.entry;

@Service
public class PromptBuilder {

    // 1) 우리팀 한글명
    private static final String SEOUL_KOR = "서울";

    // 2) 한글 ↔ 영문 키 맵 (필요에 따라 남겨두세요)
    private static final Map<String, String> kor2eng = Map.ofEntries(
            entry("대전",   "DAEJEON HANA"),
            entry("전북",   "JEONBUK"),
            entry("울산",   "ULSAN"),
            entry("김천",   "GIMCHEON"),
            entry("포항",   "POHANG"),
            entry("광주",   "GWANGJU"),
            entry("강원",   "GANGWON"),
            entry("서울",   "SEOUL"),
            entry("안양",   "ANYANG"),
            entry("수원FC", "SUWON FC"),
            entry("제주",   "JEJU"),
            entry("대구",   "DAEGU")
    );

    public static String build(
            List<MyData> myList,
            List<KLeagueScraperService.Standing> standings,
            Schedule nextMatch
    ) {
        // 4) 승/무/패 카운트
        long winCount  = myList.stream().filter(d -> "승".equals(d.getSchedule().getResult())).count();
        long drawCount = myList.stream().filter(d -> "무".equals(d.getSchedule().getResult())).count();
        long loseCount = myList.stream().filter(d -> "패".equals(d.getSchedule().getResult())).count();

        // 5) 영문→한글 팀명 역맵 생성
        Map<String, String> eng2kor = kor2eng.entrySet().stream()
                .collect(Collectors.toMap(Map.Entry::getValue, Map.Entry::getKey));

        // 5-1) W/D/L → 한글 매핑
        Map<String, String> resultMap = Map.of(
                "W", "승",
                "D", "무",
                "L", "패"
        );

        // 6) 순위 표의 테이블 행: 팀명·폼 모두 한글로 변환
        String tableRows = standings.stream()
                .map(s -> {
                    // 팀명 영→한
                    String teamKor = eng2kor.getOrDefault(s.team, s.team);
                    // recentForm ("W·D·L·…")을 승·무·패 형식으로 변환
                    String korForm = Arrays.stream(s.recentForm.split("·"))
                            .map(code -> resultMap.getOrDefault(code, code))
                            .collect(Collectors.joining("·"));
                    return String.format("| %d | %s | %s |",
                            s.rank, teamKor, korForm);
                })
                .collect(Collectors.joining("\n"));

        // 포맷터 정의
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy년 M월 d일");
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("H시 m분");

        // 7) 다음 경기
        String opponentKor = "";
        String nextText;
        if (nextMatch != null) {
            opponentKor = SEOUL_KOR.equals(nextMatch.getHomeTeam())
                    ? nextMatch.getAwayTeam()
                    : nextMatch.getHomeTeam();
            LocalDate date = nextMatch.getMatchDate();
            LocalTime time = nextMatch.getMatchTime();
            String formattedDate = date.format(dateFormatter);
            String formattedTime = time.format(timeFormatter);
            nextText = String.format("%s vs %s  %s  %s  장소: %s",
                    nextMatch.getHomeTeam(), nextMatch.getAwayTeam(),
                    formattedDate, formattedTime,
                    nextMatch.getLocation());
        } else {
            nextText = "다음 경기 일정이 없습니다.";
        }

        // 8) 서울/상대 스탠딩 조회
        Map<String, KLeagueScraperService.Standing> standMap = standings.stream()
                .collect(Collectors.toMap(s -> s.team, Function.identity()));
        var seoulSt = standMap.get(SEOUL_KOR);
        var oppSt   = standMap.get(opponentKor);
        int seoulRank    = seoulSt != null ? seoulSt.rank       : 0;
        int oppRank      = oppSt   != null ? oppSt.rank         : 0;
        String seoulForm = seoulSt != null ? seoulSt.recentForm : "";
        String oppForm   = oppSt   != null ? oppSt.recentForm   : "";

        // 9) 프롬프트 합치기 (명령문 하나도 변경 없음)
        return String.join("\n",
                ":robot:AI 예측 결과:robot:",
                "당신은 K리그1 FC 서울 경기 예측 전문가입니다.",
                "전체 비율중 직관 기록은 0.2, K리그 순위는 0.4, 다음 경기 일정을 0.4으로 해서 다음 예측 결과를 분석해",
                "현재 k리그 순위, 다음경기, 예측요청, 근거가 나타나게 양식을 꼭 지켜줘.",
                "무조건 아래 양식대로만 만들어줘야 해.",
                "예측 결과 값(승/패/무, 스코어)은 너가 수정해서 반환해. 절대로 그대로 반환하지 마.",
                "만약 스코어가 같으면 무승부, 다르면 승/패를 결정지어야해 기준은 서울이야",
                "<양식 시작>, <양식 끝> 태그는 반환하지 마. 제외해. 제발.",
                "근거는 너가 참고할 추론 양식이야. 저렇게 추론해서 결론을 내려.",
                "절대 근거를 그대로 사용하지 마. 너가 새로 추론해서 반환해",
                "근거 반환할 때 문장 마다 줄바꿈 해서 반환해",
                "홈,원정은 예측결과에는 반영하지 않지만 근거에는 조금만 반영해서 반환해.",
                "순위|팀|최근5경기 폼 쪽 -하이픈, |파이프, 공백 등 전부 갯수 그대로 가져가서 반환해 추가하거나 삭제하지마",
                "",
                "",
                "<양식 시작>",
                "📊 직관 기록 요약",
                String.format("승: %d  무: %d  패: %d  ", winCount, drawCount, loseCount),
                "경기 수: " + myList.size(),
                "",
                "🏆 현재 K리그 순위",
                "| 순위 | 팀 | 최근 5경기 폼 |",
                "|:---:|:-----:|:------------:|",
                tableRows,
                "",
                "",
                "⚽️ 다음 경기",
                nextText,
                "",
                "",
                "예측 요청",
                String.format("1️⃣ 우리팀 %s: %d위 (최근 5경기 : %s)", SEOUL_KOR, seoulRank, seoulForm),
                String.format("2️⃣ 상대팀 %s: %d위 (최근 5경기 : %s)", opponentKor, oppRank, oppForm),
                String.format("3️⃣ 예측 결과: %s vs %s → 승, 예상 스코어 : 1:1", SEOUL_KOR, opponentKor),
                "4️⃣ 근거:",
                "서울의 최근 경기 폼이 대구보다 우세하며, 대구는 최근 5경기에서 승리가 없습니다.",
                "서울은 순위에서 대구보다 앞서 있으며, 최근 5 경기에서 더 나은 성적을 보이고 있습니다",
                "아무래도 이번 경기의 홈은 서울이므로, 대구가 다소 고전할 것 으로 예측됩니다.",
                "따라서 이번 경기는 서울의 승리가 예상됩니다.",
                "<양식 끝>",
                ""
        );
    }
}
