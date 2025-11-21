# myFCseoul ⚽ ( 축구 직관 웹 서비스 )
**프로축구 직관 기록 & AI 승부 예측 웹 서비스** <br>
[**https://www.myfcseoul.com/**](https://www.myfcseoul.com/)

> 직관 기록을 관리하고 AI를 활용해 다음 경기 결과를 예측하는 FC서울 팬 전용 웹 서비스입니다.

---

## 0. 목차
> 1. 프로젝트 개요
> 2. 사용 기술
> 3. 아키텍처
> 4. 화면 구성
> 5. 주요 기능 설계
> 6. 트러블 슈팅

---

## 1. 👨‍💻 프로젝트 개요

- 프로젝트명: myFCseoul
- 개발 기간: 2025.04 ~ 2025.10 (약 6개월)
- 인원: 1인 개발



### 1-1. 개발 목적

- 프로축구팀을 응원하러 가는 FC서울 팬들이
    - 자신의 직관 기록(언제, 어떤 경기) 을 남기고
    - 나와 팀의 승률을 비교하고
    - AI로 다음 경기 결과를 예측해보는 재미를 제공하는 웹 서비스

<br>

## 2. ⚒️ 사용 기술

### 2-1. Backend
<img src="https://img.shields.io/badge/java-007396?style=for-the-badge&logo=OpenJDK&logoColor=white"> <img src="https://img.shields.io/badge/Spring-6DB33F?style=for-the-badge&logo=Spring&logoColor=white"> <img src="https://img.shields.io/badge/springboot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white"> <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=MySQL&logoColor=white"> <img src="https://img.shields.io/badge/Hibernate-59666C?style=for-the-badge&logo=Hibernate&logoColor=white"> <img src="https://img.shields.io/badge/chatGPT-74aa9c?style=for-the-badge&logo=openai&logoColor=white"> <img src="https://img.shields.io/badge/-selenium-%43B02A?style=for-the-badge&logo=selenium&logoColor=white">


### 2-2. Frontend
<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=white"> <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=HTML5&logoColor=white"> <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=CSS3&logoColor=white"> <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=white">


### 2-3. Infra & DevOps
<img src="https://img.shields.io/badge/Amazon%20RDS-1f77b4?style=for-the-badge&logo=Amazon%20EC2&logoColor=white"> <img src="https://img.shields.io/badge/Amazon%20EC2-FF9900?style=for-the-badge&logo=Amazon%20EC2&logoColor=white"> <img src="https://img.shields.io/badge/Amazon%20S3-569A31?style=for-the-badge&logo=Amazon%20S3&logoColor=white"> <img src="https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white"> <img src="https://img.shields.io/badge/docker-%230db7ed?style=for-the-badge&logo=docker&logoColor=white"> <img src="https://img.shields.io/badge/Cloudflare-F38020?style=for-the-badge&logo=Cloudflare&logoColor=white"> 

<br>

## 3. 🌐 아키텍처

### 3-1. 시스템 아키텍처

<img width="1280" height="720" alt="Image" src="https://github.com/user-attachments/assets/150a6ccf-f6ac-45a7-94d1-974f16f0c550" />
<br>

### 3-2. DB 설계 (ERD)

<img width="3360" height="2689" alt="Image" src="https://github.com/user-attachments/assets/729863a4-263b-490a-9ca9-3d57c8990360" />
<br>

### 3-3. 프로젝트 구조

<details>
<summary>프로젝트 구조 펼쳐보기</summary>

```text
├── myFCseoul
│   ├── README.md
│   ├── backend
│   │   ├── Dockerfile
│   │   ├── build.gradle
│   │   ├── gradle
│   │   ├── gradle.properties
│   │   ├── gradlew
│   │   ├── gradlew.bat
│   │   ├── settings.gradle
│   │   └── src
│   │       ├── main
│   │       │   ├── java
│   │       │   │   └── com
│   │       │   │       └── myfcseoul
│   │       │   │           └── backend
│   │       │   │               ├── BackendApplication.java
│   │       │   │               ├── config
│   │       │   │               ├── controller
│   │       │   │               ├── dto
│   │       │   │               ├── model
│   │       │   │               ├── repository
│   │       │   │               └── service
│   │       │   └── resources
│   │       │       ├── application.properties
│   │       │       └── templates
│   │       │           └── home.html
│   ├── certbot
│   │   ├── log
│   │   └── www
│   ├── docker-compose.yml
│   ├── frontend
│   │   ├── Dockerfile
│   │   ├── README.md
│   │   ├── build
│   │   ├── config
│   │   ├── craco.config.js
│   │   ├── default.conf
│   │   ├── git
│   │   ├── package-lock.json
│   │   ├── package.json
│   │   ├── public
│   │   ├── scripts
│   │   └── src
│   │       ├── App.css
│   │       ├── App.js
│   │       ├── App.test.js
│   │       ├── components
│   │       │   └── messenger
│   │       ├── css
│   │       ├── hooks
│   │       ├── index.css
│   │       ├── index.js
│   │       ├── logo.svg
│   │       ├── pages
│   │       └── reportWebVitals.js
│   └── nginx
│       └── default.conf
└── tree.txt
```
</details> 
<br>

## 4. 🖥️ 화면 구성
### 4-1. **로그인 화면**
<img width="1453" height="736" alt="Image" src="https://github.com/user-attachments/assets/dcafbe68-7ae0-4b1d-bb9e-3315f33944e4" />
<br>
카카오 OAuth 2.0을 통해 간편하게 로그인할 수 있는 화면<br>

---
### 4-2. **메인 화면**
<img width="2438" height="2222" alt="Image" src="https://github.com/user-attachments/assets/13adbb0f-800f-4c8e-a737-eb79211e59ee" />
<br>
경기 일정, 나의 직관 성적, 랭킹을 한눈에 볼 수 있는 대시보드 화면<br>

---
### 4-3. **직관 등록 화면**
<img width="1453" height="1179" alt="Image" src="https://github.com/user-attachments/assets/7a93dc28-2d29-43e9-8a93-55f333676366" />
<br>
관람한 경기의 티켓·예매 내역 사진을 업로드하여 직관을 등록할 수 있는 화면  
등록된 직관 정보는 출석 통계 및 승률 분석, 랭킹 산정에 활용<br>

---
### 4-4. **다이어리 화면**
<img width="2408" height="2672" alt="Image" src="https://github.com/user-attachments/assets/09e14743-586c-48f8-93d3-ad85ecb36539" />
<br>
경기 관람 소감과 일상을 텍스트와 사진으로 기록할 수 있는 개인 다이어리 화면<br>

---
### 4-5. **AI 경기 예측 화면**
<img width="5623" height="2964" alt="Image" src="https://github.com/user-attachments/assets/02df5148-01a6-4edf-9d8f-6b515ab33343" />
<br>
K리그 순위, 상대 팀 전적, 나의 직관 기록을 기반으로 다음 경기 결과를 예측해 주는 화면
OpenAI API를 활용하여 하루 1회 텍스트 형태의 상세 예측 리포트를 제공<br>

---
### 4-6. **채팅 화면**
<img width="1469" height="740" alt="Image" src="https://github.com/user-attachments/assets/979db278-a3d0-4ac6-95ec-0ff4c5f1feec" />
<br>
다른 사용자와 1:1로 대화하며 직관 후기와 응원 메시지를 나눌 수 있는 채팅 화면<br>

---
### 4-7. **프로필 화면**
<img width="1453" height="736" alt="Image" src="https://github.com/user-attachments/assets/73ea814e-0550-4b09-ba31-67fa13ecf454" />
<br>
로그아웃 및 닉네임 변경 가능한 화면<br>

---
### 4-8. **관리자 출석 인증 화면**
<img width="1453" height="736" alt="Image" src="https://github.com/user-attachments/assets/37478a2d-18b3-400f-acbb-af1a3295cc81" />
<br>
사용자가 제출한 직관 인증 사진을 관리자 계정이 승인·거절할 수 있는 화면
대기 중인 요청의 경기 정보와 이미지를 확인하고 버튼 한 번으로 출석 처리 상태를 변경 가능<br>


---
### 4-9. **모바일 화면**
<img width="3617" height="5152" alt="Image" src="https://github.com/user-attachments/assets/e32b1c10-59df-4ff8-9e23-6ab6873cb3c4" />
<br>
모바일 환경도 고려하여 반응형 레이아웃을 구성<br>

---
<br>

## 5. 📌 주요 기능 설계
### 5-1. **Kakao 소셜 로그인 (OAuth 2.0) 기능**
<img width="805" height="440" alt="Image" src="https://github.com/user-attachments/assets/9bf370bb-22aa-4dff-8c1f-dbf28a55b0f7" />
<br>
카카오 OAuth 2.0 기반 소셜 로그인을 통해 사용자를 인증합니다. 

#### API 설계

1. **사용자 요청**
    - 클라이언트에서 “카카오 로그인” 버튼 클릭
    - `GET /oauth2/authorization/kakao` 요청으로 Spring Security 필터 체인 진입

2. **OAuth2 로그인 필터**
    - `OAuth2LoginAuthenticationFilter` 가 로그인 콜백(`/login/oauth2/code/kakao`) 요청을 가로챔
    - `OAuth2LoginAuthenticationProvider` 에 인증 처리를 위임

3. **Access Token 발급 & 유저 정보 조회**
    - Provider가 카카오로부터 **Access Token** 을 발급받음
    - `OAuth2UserRequest` 생성 후  
      `CustomOAuth2UserService.loadUser(userRequest)` 호출
    - `super.loadUser(userRequest)` 를 통해 카카오 유저 정보 API(`/v2/user/me`) 호출  
      → `id`, `kakao_account.profile.nickname` 등의 attributes 수신

4. **User 엔티티 동기화**
    - `UserRepository.findByUserId(kakaoId)` 로 기존 사용자 조회
    - 없으면 신규 생성, 있으면 닉네임 등 정보 갱신
    - 기본 권한은 `user` 로 설정, 관리자 계정은 `role = admin` 으로 관리
    - DB 저장 후, `DefaultOAuth2User(principal)` 생성

5. **SecurityContext / 세션 저장**
    - Provider가 `principal` 로 `Authentication` 객체 생성
    - `OAuth2LoginAuthenticationFilter` 가 이를 **SecurityContext** 에 저장
    - `SecurityContextPersistenceFilter` 가 `HttpSession(JSESSIONID)` 과 동기화  
      → 이후 요청부터는 세션 기반으로 인증 상태 유지

6. **로그인 성공 처리**
    - `CustomOAuth2AuthenticationSuccessHandler` 실행
    - `https://www.myfcseoul.com/` 으로 리다이렉트

7. **인가(Authorization)**
    - `SecurityConfig` 에서 URL 별 접근 권한 설정
        - `/api/admin/**` : `role = admin` 사용자만 접근
        - `/api/rankings`, `/api/schedule` : 인증 없이 허용
        - 그 외 대부분의 API : 인증 필수

#### 관련 소스 코드

- [SecurityConfig.java](backend/src/main/java/com/myfcseoul/backend/config/SecurityConfig.java)
- [CustomOAuth2UserService.java](backend/src/main/java/com/myfcseoul/backend/service/CustomOAuth2UserService.java)
- [CustomOAuth2AuthenticationSuccessHandler.java](backend/src/main/java/com/myfcseoul/backend/service/CustomOAuth2AuthenticationSuccessHandler.java)
- [UserRepository.java](backend/src/main/java/com/myfcseoul/backend/repository/UserRepository.java)


---

### 5-2. **직관 기록 기능**
<img width="800" height="436" alt="Image" src="https://github.com/user-attachments/assets/66f27f0b-d777-46ad-aee0-ed064904a34b" />
<br>
세션 기반 인증과 Spring Data JPA를 이용해 경기별 직관 사진을 제출하고 <br>
나의 출석 내역을 조회할 수 있도록 설계했습니다.  

#### API 설계

1. **출석 사진 제출 – `POST /api/mydata/submit`**
   - Request Body (JSON)
     ```json
     {
       "scheduleId": 3,
       "photoKey": "s3/attendance/2025-04-01-xxxx.jpg"
     }
     ```
   - 처리 과정
     - `Principal` 에서 카카오 고유 ID를 꺼내 `UserRepository.findByUserId(...)` 로 `User` 조회  
     - `scheduleId` 로 `ScheduleRepository.findById(...)` 호출  
     - `(user, schedule)` 조합으로 `MyDataRepository.findByUserAndSchedule(...)` 조회  
       - 이미 존재하면 해당 레코드 업데이트  
       - 없으면 새로운 `MyData` 엔티티 생성
     - `photoKey` 세팅, `attended = 0`(승인 대기) 로 상태 저장
   - 응답
     - `{ "message": "출석 사진이 제출되었습니다. 승인 대기 중입니다." }`

2. **나의 출석 내역 조회 – `GET /api/mydata`**
   - 처리 과정
     - `Principal` 로 현재 로그인 사용자의 `userId` 확인  
     - `UserRepository.findByUserId(...)` 로 `User` 엔티티 조회  
     - `MyDataRepository.findByUser(user)` 로 해당 사용자의 모든 출석 데이터 조회
   - 응답
     - `MyData` 리스트(JSON)  
       - 각 항목에 `attended`(0/1/2), `schedule`(경기 정보), `photoKey` 포함  
       - 프론트에서 직관 히스토리/출석 현황/그래프 등에 활용

#### 관련 소스 코드

- [MyDataController.java](backend/src/main/java/com/myfcseoul/backend/controller/MyDataController.java)
- [AdminMyDataController.java](backend/src/main/java/com/myfcseoul/backend/controller/AdminMyDataController.java)
- [MyDataRepository.java](backend/src/main/java/com/myfcseoul/backend/repository/MyDataRepository.java)
- [ScheduleRepository.java](backend/src/main/java/com/myfcseoul/backend/repository/ScheduleRepository.java)



---

### 5-2. **랭킹 기능**
<img width="874" height="329" alt="Image" src="https://github.com/user-attachments/assets/3bc99b20-3aed-4456-8ed0-166601ff50c9" />
<br>
직관 기록과 경기 결과를 기반으로 랭킹을 계산하여 메인 페이지에 제공하는 기능입니다. 랭킹 계산은 한 번만 수행하고, 그 결과를 서버 메모리 캐시에 저장해 빠르게 조회할 수 있도록 설계했습니다.

---

#### API 설계

1. **랭킹 조회 – `GET /api/rankings`**

    - **요청 파라미터**
        - 없음 (전체 랭킹을 한 번에 조회)

    - **처리 과정**
        1. `RankingController.getRankings()` 호출
           ```java
           @GetMapping("/rankings")
           public RankingResponse getRankings() {
               return rankingService.getCachedRanking();
           }
           ```
        2. `RankingService.getCachedRanking()` 에서
            - 메모리에 캐시된 `RankingResponse cache` 를 반환
            - 애플리케이션 시작 직후 등으로 `cache == null` 인 경우  
              `refreshCache()` 를 한 번 실행하여 캐시를 채운 뒤 반환
        3. 최종적으로 아래 구조의 JSON 을 반환
            - `attendanceKings` : 직관 횟수 상위 N명
            - `winFairies` : 직관 승률 상위 N명

    - **응답 예시**
      ```json
      {
        "attendanceKings": [
          { "nickname": "직관1등", "attendanceCount": 15 }
        ],
        "winFairies": [
          {
            "nickname": "승리요정1",
            "totalAttendance": 10,
            "winCount": 8,
            "winRate": 80.0
          }
        ]
      }
      ```

---

#### 내부 동작 구성

1. **랭킹 응답 DTO – `RankingResponse`**

    - **필드**
        - `List<AttendanceRankDTO> attendanceKings`
            - 닉네임 + 직관 횟수
        - `List<WinRateRankDTO> winFairies`
            - 닉네임 + 총 직관 수 + 승리 수 + 승률(%)

    - 랭킹 조회 결과를 하나의 객체로 묶어 `/api/rankings` 응답 바디로 직렬화하는 역할을 한다.

2. **비즈니스 로직 및 캐싱 – `RankingService`**

    - **필드**
        - `UserRepository userRepo` : 랭킹 계산에 필요한 집계 쿼리 제공
        - `private volatile RankingResponse cache;`
            - 서버 메모리에 저장되는 랭킹 캐시
            - `volatile` 로 여러 스레드에서 항상 최신 값이 보이도록 보장

    - **주요 메서드**
        - `refreshCache()`
          ```java
          @Scheduled(cron = "0 0 0 * * *", zone = "Asia/Seoul")
          public void refreshCache() {
              var top5 = PageRequest.of(0, 5);
              List<AttendanceRankDTO> attends = userRepo.findTopAttendance(top5);
              List<WinRateRankDTO>    wins    = userRepo.findTopWinRate(top5);
   
              cache = new RankingResponse(attends, wins);
              System.out.println("【RankingService】 랭킹 캐시 업데이트: " + cache);
          }
          ```
            - 매일 00:00(Asia/Seoul) 에 스케줄러가 실행
            - `UserRepository` 의 집계 쿼리를 통해
                - 직관 횟수 TOP N
                - 직관 승률 TOP N
                  을 조회
            - 조회 결과를 새로운 `RankingResponse` 로 만들어 `cache` 필드에 저장  
              → 다이어그램 상의 **Server Memory Cache** 업데이트
            - 생성자에서도 한 번 호출하여 애플리케이션 시작 시 즉시 캐시를 채움
        - `getCachedRanking()`
          ```java
          public RankingResponse getCachedRanking() {
              if (cache == null) {
                  refreshCache();
              }
              return cache;
          }
          ```
            - 컨트롤러에서 호출하는 메서드로,  
              이미 계산된 캐시가 있다면 그대로 반환하고  
              없으면 한 번만 `refreshCache()` 를 수행한 뒤 반환
            - 덕분에 `/api/rankings` 요청마다 무거운 집계 쿼리를 다시 수행하지 않고,  
              **캐시 조회만으로 빠르게 응답**할 수 있다.

3. **집계 쿼리 – `UserRepository`**

    - **직관왕 – `findTopAttendance(Pageable pageable)`**
      ```java
      @Query("""
          SELECT u.nickname AS nickname,
                 COUNT(md)  AS attendanceCount
            FROM MyData md
            JOIN md.user u
           WHERE md.attended = 1
             AND u.nickname <> 'Unknown'
           GROUP BY u.nickname
           ORDER BY COUNT(md) DESC
          """
      )
      List<AttendanceRankDTO> findTopAttendance(Pageable pageable);
      ```
        - 직관 인증 완료(`attended = 1`)된 `MyData` 기준으로
            - 유저 닉네임별 직관 횟수를 카운트
            - 횟수 기준 내림차순 정렬 후 상위 N명 반환

    - **승리 요정 – `findTopWinRate(Pageable pageable)`**
      ```java
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
      ```
        - 사용자의 직관 경기(`attended = 1`) 중 결과가 있는 경기만 대상으로
            - 총 직관 수(`COUNT(md)`)
            - 승리 수(`SUM(CASE WHEN s.result = '승' THEN 1 ELSE 0 END)`)
            - 승률(`winCount * 100.0 / totalAttendance`)
              를 한 번에 계산
        - `HAVING COUNT(md) > 5` 조건으로 **최소 5경기 이상 직관한 사용자**만 포함
        - 승률 기준 내림차순 정렬 후 상위 N명 반환

---

#### 관련 소스 코드

- [RankingController.java](backend/src/main/java/com/myfcseoul/backend/controller/RankingController.java)
- [RankingService.java](backend/src/main/java/com/myfcseoul/backend/service/RankingService.java)
- [RankingResponse.java](backend/src/main/java/com/myfcseoul/backend/dto/RankingResponse.java)
- [AttendanceRankDTO.java](backend/src/main/java/com/myfcseoul/backend/dto/AttendanceRankDTO.java)
- [WinRateRankDTO.java](backend/src/main/java/com/myfcseoul/backend/dto/WinRateRankDTO.java)
- [UserRepository.java](backend/src/main/java/com/myfcseoul/backend/repository/UserRepository.java)

---

### 5-3. **AI 경기 예측 기능**
<img width="922" height="487" alt="Image" src="https://github.com/user-attachments/assets/675e4e4d-0f57-4fe2-9463-3ee9a4732a85" />
<br>
사용자의 직관 기록(승/무/패), K리그 공식 사이트에서 스크래핑한 현재 순위 및 최근 5경기 폼
그리고 DB에 저장된 다음 경기 일정 정보를 종합해서 OpenAI GPT 모델에게 프롬프트를 전달하고 다음 경기 결과(승/무/패 + 스코어)를 분석·예측하는 기능입니다.

#### API 설계

1. **경기 예측 요청 – `GET /api/predict?userId=...` , `POST /api/predict?userId=...`**

    - **요청 파라미터**
        - `userId` : 예측을 요청하는 사용자 ID (카카오 고유 ID)

    - **처리 과정**
        1. `UserRepository.findById(userId)` 로 사용자 조회  
           → 없으면 `401 UNAUTHORIZED` + `"로그인이 필요합니다."`
        2. **일반 사용자**인 경우, `lastPredictionAt` 기준으로  
           → **하루 1회만 예측 가능**하도록 제한
            - 오늘 이미 예측했다면 `429 TOO_MANY_REQUESTS` 반환
        3. `MyDataService.getByUserId(userId)` 로 사용자의 직관 데이터 조회
            - 내부에서 `MyDataRepository.findByUserUserIdAndAttended(userId, 1)` 실행
            - 승인된(`attended = 1`) 직관 데이터만 필터링
        4. `ScheduleService.getNextMatch()` 로 **다음 경기 일정** 조회
        5. `KLeagueScraperService.fetchStandings()` 로  
           K리그 팀 순위 + 최근 5경기 폼(승·무·패) 스크래핑
        6. 위 세 데이터를 `PromptBuilder.build(...)` 에 전달해  
           → GPT에게 전달할 **한국어 프롬프트 문자열 생성**
        7. `OpenAiClientService.getPrediction(prompt)` 호출  
           → OpenAI Chat Completions API (`gpt-4.1-mini`)로 예측 결과 문장 획득
        8. **일반 사용자**인 경우
            - `user.lastPredictionAt = now()`
            - `user.lastPredictionResult = prediction`  
              로 DB에 저장 (하루 1회 제한 및 캐시 용도)
        9. 최종 예측 결과를 JSON으로 반환:
           ```json
           {
             "prediction": "서울이 2:1로 승리할 것으로 예상됩니다... (이하 GPT 응답)"
           }
           ```

    - **응답**
        - 성공: `200 OK` + `{ "prediction": "<AI 예측 결과 텍스트>" }`
        - 하루 1회 제한 초과: `429 TOO_MANY_REQUESTS`
        - 미로그인 또는 잘못된 userId: `401 UNAUTHORIZED`

2. **오늘의 예측 결과 조회 – `GET /api/prediction`**

    - **인증 방식**
        - `Principal` 을 사용해 현재 세션의 로그인 사용자 식별  
          → `principal.getName()` = 카카오 `userId`

    - **처리 과정**
        1. `principal == null` 이면 `401 UNAUTHORIZED`
        2. `UserRepository.findById(principal.getName())` 로 사용자 조회
        3. `user.lastPredictionAt` 의 날짜가 **오늘**이고  
           `lastPredictionResult` 가 존재하면  
           → 오늘 이미 생성해 둔 예측 결과를 그대로 반환
        4. 오늘 예측한 기록이 없다면 `204 No Content` 반환

    - **응답 예시**
      ```json
      {
        "prediction": "서울이 1:0으로 근소하게 승리할 것으로 예상됩니다..."
      }
      ```

---

#### 내부 동작 구성

1. **K리그 순위·폼 수집 – `KLeagueScraperService`**
    - Selenium(ChromeDriver) + Jsoup 사용
    - `https://www.kleague.com/record/team.do` 에 접속 후
        - 그룹 A/B 순위 테이블(`#ts1`, `#ts2`)에서
        - 팀명, 순위, 최근 5경기 폼(승·무·패)을 파싱
    - `Standing(group, rank, team, recentForm)` 리스트로 반환

2. **프롬프트 생성 – `PromptBuilder`**
    - **입력**
        - `List<MyData> myList` : 사용자의 승인된 직관 기록(`attended = 1`)
        - `List<Standing> standings` : 현재 리그 순위/폼
        - `Schedule nextMatch` : 다음 경기 정보(홈/원정, 일시, 장소)
    - **처리**
        - 직관 승/무/패 카운트
        - 순위/폼을 **마크다운 테이블 형식**으로 변환
        - 다음 경기 정보를  
          예) `"서울 vs 대구  2025년 4월 1일 19시 00분  장소: 상암월드컵경기장"`  
          같은 문장으로 포맷팅
        - “예측 요청/양식/근거 작성 방법”을 상세히 적은  
          긴 한국어 프롬프트 문자열 생성
    - **출력**
        - OpenAI Chat API에 그대로 전달할 최종 `String prompt`

3. **OpenAI 호출 – `OpenAiClientService`**
    - `POST https://api.openai.com/v1/chat/completions`
    - **Request Body**
      ```json
      {
        "model": "gpt-4.1-mini",
        "messages": [
          { "role": "user", "content": "<PromptBuilder가 만든 프롬프트>" }
        ],
        "temperature": 0.2
      }
      ```
    - 응답에서 `choices[0].message.content` 를 꺼내  
      → 최종 예측 결과 텍스트로 사용

---

#### 관련 소스 코드

- [PredictionController.java](backend/src/main/java/com/myfcseoul/backend/controller/PredictionController.java)
- [OpenAiClientService.java](backend/src/main/java/com/myfcseoul/backend/service/OpenAiClientService.java)
- [PromptBuilder.java](backend/src/main/java/com/myfcseoul/backend/service/PromptBuilder.java)
- [KLeagueScraperService.java](backend/src/main/java/com/myfcseoul/backend/service/KLeagueScraperService.java)
- [MyDataService.java](backend/src/main/java/com/myfcseoul/backend/service/MyDataService.java)
- [ScheduleService.java](backend/src/main/java/com/myfcseoul/backend/service/ScheduleService.java)

---

### 5-4. **채팅 기능**

<img width="841" height="155" alt="Image" src="https://github.com/user-attachments/assets/fb8501b5-40c1-4201-94b6-e0df9db97dad" />

<img width="856" height="441" alt="Image" src="https://github.com/user-attachments/assets/48be8a28-6ed9-4923-a81a-a662d399613a" />
<br>
Spring WebSocket + STOMP 기반의 실시간 통신으로 DM 방 생성, 저장, 조회까지 모두 서버에서 관리하며 사용자는 다른 유저와 실시간으로 메시지를 주고받을 수 있습니다.
<br>

#### API 설계

1. **채팅방 생성/조회 – `GET /api/chat/room?senderId=...&receiverId=...`**

    - **요청 파라미터**
        - `senderId` : 채팅을 시작하는 사용자 ID (카카오 고유 ID)
        - `receiverId` : 상대 사용자 ID

    - **처리 과정**
        1. `ChatService.getOrCreateRoom(senderId, receiverId)` 호출  
           → 내부에서 `ChatRoomRepository.findByUsers(senderId, receiverId)` 실행  
           → (user1=A, user2=B) 또는 (user1=B, user2=A) 조합으로 **기존 방이 있는지 조회**
        2. 기존 방이 없다면
            - `UserRepository.findById(senderId)`
            - `UserRepository.findById(receiverId)`  
              로 두 사용자 엔티티를 조회하고
            - `ChatRoom(user1, user2)` 엔티티를 생성하여 DB에 저장
        3. 최종적으로 `roomId` 를 JSON으로 반환

    - **응답 예시**
      ```json
      {
        "roomId": 12
      }
      ```

2. **채팅 히스토리 조회 – `GET /api/chat/{roomId}`**

    - **요청 경로 변수**
        - `roomId` : 채팅방 ID

    - **처리 과정**
        1. `ChatService.getHistory(roomId)` 호출  
           → `ChatMessageRepository.findByRoomRoomIdOrderBySentAtAsc(roomId)` 실행  
           → 해당 방의 메시지를 **전송 시각 오름차순**으로 조회
        2. 각 `ChatMessage` 엔티티를 `ChatMessageDTO` 로 변환
            - `roomId`, `senderId`, `content`, `senderNickname`, `sentAt` 등을 매핑
        3. DTO 리스트를 JSON 배열로 반환

    - **응답 예시**
      ```json
      [
        {
          "roomId": 12,
          "senderId": "123456",
          "receiverId": null,
          "content": "안녕하세요!",
          "senderNickname": "FC서울팬1",
          "sentAt": "2025-05-20 19:11:23.123"
        }
      ]
      ```

3. **실시간 1:1 DM 전송 – WebSocket `/ws-chat` + STOMP `/app/chat/private`**

    - **WebSocket/STOMP 연결**
        - 클라이언트는 SockJS + STOMP 클라이언트로  
          `ws://<서버>/ws-chat` 엔드포인트에 Handshake 요청
        - 서버 설정 (`WebSocketConfig`)
          ```java
          registry.addEndpoint("/ws-chat")
                  .setAllowedOriginPatterns("*")
                  .withSockJS();
   
          registry.setApplicationDestinationPrefixes("/app");
          registry.enableSimpleBroker("/queue");
          ```

    - **클라이언트 → 서버 (메시지 전송)**
        - 클라이언트는 `/app/chat/private` 목적지로 STOMP SEND:
          ```json
          {
            "roomId": 12,
            "senderId": "123456",
            "receiverId": "654321",
            "content": "안녕!"
          }
          ```
        - 이 메시지는 서버의
          ```java
          @MessageMapping("/chat/private")
          public void handlePrivateMessage(@Payload ChatMessageDTO dto) { ... }
          ```
          메서드로 매핑된다.

    - **서버 내부 처리**
        1. DTO 유효성 검사 (senderId/receiverId/content null·공백 체크)
        2. `ChatService.getOrCreateRoom(senderId, receiverId)` 로 방 조회/생성
        3. `ChatService.saveMessage(roomId, senderId, content)` 호출  
           → `ChatRoomRepository.findById(roomId)` + `UserRepository.findById(senderId)`로 엔티티 조회  
           → `ChatMessage` 엔티티 생성 후 `ChatMessageRepository.saveAndFlush(...)` 로 DB에 저장
        4. 응답용 DTO에 `roomId`, `senderNickname`, `sentAt` 등을 세팅

    - **서버 → 클라이언트 (메시지 푸시)**
        - 저장 후, 수신자에게 WebSocket으로 실시간 전달:
          ```java
          messagingTemplate.convertAndSendToUser(
              dto.getReceiverId(),
              "/queue/messages",
              dto
          );
          ```
        - 실제 목적지: `/user/{receiverId}/queue/messages`
        - 클라이언트는 다음과 같이 구독:
          ```js
          stompClient.subscribe('/user/queue/messages', onMessage);
          ```
        - 수신자는 **자신에게 도착한 메시지만** 실시간으로 전달받아 채팅창에 렌더링한다.

---

#### 내부 동작 구성

1. **WebSocket/STOMP 설정 – `WebSocketConfig`**
    - `@EnableWebSocketMessageBroker` + `WebSocketMessageBrokerConfigurer` 로 STOMP 메시지 브로커 활성화
    - `/ws-chat` 엔드포인트를 SockJS 기반 WebSocket 엔드포인트로 등록
    - 클라이언트 발신 경로 prefix: `/app`  
      → `/app/chat/private` → `@MessageMapping("/chat/private")` 로 매핑
    - 서버 발신 경로 prefix: `/queue`  
      → `convertAndSendToUser(userId, "/queue/messages", ...)` 호출 시  
      실제 목적지 `/user/{userId}/queue/messages` 로 라우팅

2. **비즈니스 로직 – `ChatService`**
    - `getOrCreateRoom(String senderId, String receiverId)`
        - `ChatRoomRepository.findByUsers(senderId, receiverId)`  
          로 두 유저 간 기존 방을 조회
        - 없으면 `UserRepository` 로 유저 엔티티 조회 후 새 `ChatRoom` 생성 및 저장
        - 트랜잭션(`@Transactional`)으로 방 생성 과정 전체를 하나의 단위로 보장
    - `saveMessage(Long roomId, String senderId, String content)`
        - `ChatRoomRepository.findById(roomId)` 로 방 존재 여부 확인
        - `UserRepository.findById(senderId)` 로 발신자 조회
        - `ChatMessage` 엔티티를 생성하여 `ChatMessageRepository.saveAndFlush(...)` 로 저장
    - `getHistory(Long roomId)`
        - `ChatMessageRepository.findByRoomRoomIdOrderBySentAtAsc(roomId)` 로  
          방 내 메시지 히스토리를 시간순으로 조회 (`@Transactional(readOnly = true)`)

3. **컨트롤러 계층 – `ChatRoomController`, `ChatController`**
    - `ChatRoomController`
        - `GET /api/chat/room`  
          → 두 사용자(senderId, receiverId) 간 DM 방을 조회하거나 없으면 생성  
          → `{"roomId": <Long>}` 형태로 응답
    - `ChatController`
        - `@MessageMapping("/chat/private")`  
          → WebSocket/STOMP 기반 실시간 DM 수신, 검증, 저장, 푸시 담당
        - `GET /api/chat/{roomId}`  
          → 특정 방의 과거 메시지 히스토리를 REST API로 제공

---

#### 관련 소스 코드

- [WebSocketConfig.java](backend/src/main/java/com/myfcseoul/backend/config/WebSocketConfig.java)
- [ChatController.java](backend/src/main/java/com/myfcseoul/backend/controller/ChatController.java)
- [ChatRoomController.java](backend/src/main/java/com/myfcseoul/backend/controller/ChatRoomController.java)
- [ChatService.java](backend/src/main/java/com/myfcseoul/backend/service/ChatService.java)
- [ChatRoomRepository.java](backend/src/main/java/com/myfcseoul/backend/repository/ChatRoomRepository.java)
- [ChatMessageRepository.java](backend/src/main/java/com/myfcseoul/backend/repository/ChatMessageRepository.java)

---

### 5-5. **다이어리 기능**
<img width="750" height="296" alt="Image" src="https://github.com/user-attachments/assets/c80bd3fa-5281-4071-90a8-a0c018fd8b9d" />
<br>
경기 직관 후 느낀 점과 사진을 다이어리 형태로 기록하고<br>
다른 FC서울 팬들의 직관 기록도 함께 구경할 수 있도록 설계했습니다.

#### API 설계

1. **다이어리 생성 – `POST /api/gallery`**
   - Request Body (JSON)
     ```json
     {
       "userId": "4540681543",
       "title": "수원전 3:0 완승 직관",
       "content": "분위기 미쳤다…",
       "imageUrl": "https://s3.../gallery/2025-04-01-xxxx.jpg",
       "createdAt": "2025-04-01T18:30:00"
     }
     ```
   - 처리 과정
     - `userId`로 `UserRepository.findById(...)` 호출 → 작성자 `User` 엔티티 조회  
     - `CreateGalleryRequestDTO` 의 필드를 이용해 `Gallery` 엔티티 생성  
       - `user`, `title`, `content`, `imageUrl`, `createdAt` 세팅  
     - `GalleryRepository.save(gallery)` 로 DB에 저장  
   - 응답
     - 생성된 `Gallery` 엔티티(JSON) + `201 CREATED`

2. **특정 사용자의 다이어리 목록 조회 – `GET /api/gallery/{userId}`**
   - 처리 과정
     - Path Variable `{userId}`를 이용해  
       `GalleryRepository.findByUserUserId(userId)` 호출  
     - 해당 사용자의 다이어리 목록을 최신순 정렬은 프론트에서 수행
   - 응답
     - `Gallery` 리스트(JSON)  
       - 각 항목에 `galleryId`, `title`, `content`, `imageUrl`, `createdAt`, `user` 정보 포함  
       - 프론트에서 `/diary/{userId}` 페이지에 그리드 카드 형태로 렌더링

3. **다이어리 수정 – `PUT /api/gallery/{galleryId}`**
   - Request Body (JSON)
     ```json
     {
       "title": "수원전 3:0 완승 직관 (사진 업데이트)",
       "content": "후반 분위기 추가 기록...",
       "imageUrl": "https://s3.../gallery/2025-04-01-updated.jpg",
       "createdAt": "2025-04-01T18:30:00"
     }
     ```
   - 처리 과정
     - `galleryId`로 `GalleryRepository.findById(...)` 호출 → 기존 다이어리 조회  
     - 작성자 `user`는 변경하지 않고,  
       `title`, `content`, `imageUrl`, `createdAt` 필드만 업데이트  
     - `GalleryRepository.save(existing)` 로 수정 내용 저장
   - 응답
     - 수정된 `Gallery` 엔티티(JSON)

4. **다이어리 삭제 – `DELETE /api/gallery/{galleryId}`**
   - 처리 과정
     - `GalleryRepository.deleteById(galleryId)` 호출로 해당 다이어리 삭제
   - 응답
     - `204 No Content`

#### 관련 소스 코드

- [Gallery.java](backend/src/main/java/com/myfcseoul/backend/model/Gallery.java)
- [GalleryRepository.java](backend/src/main/java/com/myfcseoul/backend/repository/GalleryRepository.java)
- [GalleryController.java](backend/src/main/java/com/myfcseoul/backend/controller/GalleryController.java)
- [CreateGalleryRequestDTO.java](backend/src/main/java/com/myfcseoul/backend/dto/CreateGalleryRequestDTO.java)
  
---

<br>

## 6. ⚠️ 트러블슈팅

### 1.

<br>
---

### 2. 
