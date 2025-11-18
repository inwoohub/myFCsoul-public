package com.myfcseoul.backend.service;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.Duration;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class KLeagueScraperService {

    public static class Standing {
        public final String group;   // "A" or "B"
        public final int    rank;    // 1..n (그룹 내 순위)
        public final String team;    // 팀명
        public final String recentForm; // "승·무·패·..."

        public Standing(String group, int rank, String team, String recentForm) {
            this.group = group;
            this.rank = rank;
            this.team = team;
            this.recentForm = recentForm;
        }
    }

    public List<Standing> fetchStandings() {
        String driverPath = System.getenv("CHROME_DRIVER");
        String chromeBin  = System.getenv("CHROME_BIN");
        if (driverPath == null || driverPath.isBlank() || chromeBin == null || chromeBin.isBlank()) {
            throw new IllegalStateException("CHROME_DRIVER / CHROME_BIN 환경변수가 설정되어 있지 않습니다.");
        }
        System.setProperty("webdriver.chrome.driver", driverPath);

        ChromeOptions options = new ChromeOptions()
                .setBinary(chromeBin)
                .addArguments(
                        "--headless=new",
                        "--no-sandbox",
                        "--disable-dev-shm-usage",
                        "--lang=ko-KR",
                        // 필요시 UA 지정
                        "--user-agent=Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
                                + "(KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36"
                );

        WebDriver driver = new ChromeDriver(options);
        try {
            driver.manage().timeouts().pageLoadTimeout(Duration.ofSeconds(20));
            driver.manage().timeouts().scriptTimeout(Duration.ofSeconds(20));

            driver.get("https://www.kleague.com/record/team.do");

            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(15));
            // ts1 또는 ts2에서 최소 1개 이상 tr이 생길 때까지
            wait.until(d -> d.findElements(By.cssSelector("#ts1 tbody tr, #ts2 tbody tr")).size() > 0);

            String html = driver.getPageSource();
            Document doc = Jsoup.parse(html);

            Elements aRows = doc.select("#ts1 tbody > tr");
            Elements bRows = doc.select("#ts2 tbody > tr");

            List<Standing> groupA = aRows.stream().map(row -> mapRow("A", row)).collect(Collectors.toList());
            List<Standing> groupB = bRows.stream().map(row -> mapRow("B", row)).collect(Collectors.toList());

            // 합쳐서 반환(원하면 group, rank로 정렬)
            return new java.util.ArrayList<Standing>() {{
                addAll(groupA);
                addAll(groupB);
            }};

        } catch (Exception e) {
            // 로깅 후 런타임 예외로 래핑(컨트롤러에서 503 등으로 변환 추천)
            throw new RuntimeException("KLeague standings 스크래핑 실패: " + e.getMessage(), e);
        } finally {
            try { driver.quit(); } catch (Exception ignore) {}
        }
    }

    private Standing mapRow(String group, Element row) {
        // 순위
        int rank = safeParseInt(row.selectFirst("td.point"));

        // 팀명: 두 번째 td의 <ta> 우선, 없으면 td 텍스트
        Element teamTa = row.selectFirst("td:nth-child(2) ta");
        String team = (teamTa != null)
                ? teamTa.text().trim()
                : row.select("td:nth-child(2)").text().trim();

        // 최근 5경기
        String recentForm = row.select("td:last-child span.record-label")
                .stream()
                .map(Element::text) // "승","무","패"
                .collect(Collectors.joining("·"));

        return new Standing(group, rank, team, recentForm);
    }

    private int safeParseInt(Element rankTd) {
        if (rankTd == null) return -1;
        // ownText()에서 숫자만 추출
        String raw = rankTd.ownText();
        if (raw == null) return -1;
        String digits = raw.replaceAll("[^0-9-]", "").trim();
        if (digits.isEmpty()) return -1;
        try {
            return Integer.parseInt(digits);
        } catch (NumberFormatException e) {
            return -1;
        }
    }
}
