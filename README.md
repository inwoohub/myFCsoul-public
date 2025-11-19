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
- 개발 기간: 2025.04 ~ 2025.010 (약 6개월)
- 인원: 1인 개발



### 🎯 개발 목적

- 프로축구팀을 응원하러 가는 FC서울 팬들이
    - 자신의 직관 기록(언제, 어떤 경기) 을 남기고
    - 나와 팀의 승률을 비교하고
    - AI로 다음 경기 결과를 예측해보는 재미를 제공하는 웹 서비스

<br>

## 2. ⚒️ 사용 기술

### Backend
<img src="https://img.shields.io/badge/java-007396?style=for-the-badge&logo=OpenJDK&logoColor=white"> <img src="https://img.shields.io/badge/Spring-6DB33F?style=for-the-badge&logo=Spring&logoColor=white"> <img src="https://img.shields.io/badge/springboot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white"> <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=MySQL&logoColor=white"> <img src="https://img.shields.io/badge/Hibernate-59666C?style=for-the-badge&logo=Hibernate&logoColor=white"> <img src="https://img.shields.io/badge/chatGPT-74aa9c?style=for-the-badge&logo=openai&logoColor=white"> <img src="https://img.shields.io/badge/-selenium-%43B02A?style=for-the-badge&logo=selenium&logoColor=white">


### Frontend
<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=white"> <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=HTML5&logoColor=white"> <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=CSS3&logoColor=white"> <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=white">


### Infra & DevOps
<img src="https://img.shields.io/badge/Amazon%20RDS-1f77b4?style=for-the-badge&logo=Amazon%20EC2&logoColor=white"> <img src="https://img.shields.io/badge/Amazon%20EC2-FF9900?style=for-the-badge&logo=Amazon%20EC2&logoColor=white"> <img src="https://img.shields.io/badge/Amazon%20S3-569A31?style=for-the-badge&logo=Amazon%20S3&logoColor=white"> <img src="https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white"> <img src="https://img.shields.io/badge/docker-%230db7ed?style=for-the-badge&logo=docker&logoColor=white"> <img src="https://img.shields.io/badge/Cloudflare-F38020?style=for-the-badge&logo=Cloudflare&logoColor=white"> 

<br>

## 3. 🌐 아키텍처

### 시스템 아키텍처

<img width="1280" height="720" alt="Image" src="https://github.com/user-attachments/assets/150a6ccf-f6ac-45a7-94d1-974f16f0c550" />
<br>

### DB 설계 (ERD)

<img width="3360" height="2689" alt="Image" src="https://github.com/user-attachments/assets/729863a4-263b-490a-9ca9-3d57c8990360" />
<br>

### 프로젝트 구조

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
### **로그인 화면**
<img width="1453" height="736" alt="Image" src="https://github.com/user-attachments/assets/dcafbe68-7ae0-4b1d-bb9e-3315f33944e4" />
<br>
카카오 OAuth 2.0을 통해 간편하게 로그인할 수 있는 화면<br>

---
### **메인 화면**
<img width="2438" height="2222" alt="Image" src="https://github.com/user-attachments/assets/13adbb0f-800f-4c8e-a737-eb79211e59ee" />
<br>
경기 일정, 나의 직관 성적, 랭킹을 한눈에 볼 수 있는 대시보드 화면<br>

---
### **직관 등록 화면**
<img width="1453" height="1179" alt="Image" src="https://github.com/user-attachments/assets/7a93dc28-2d29-43e9-8a93-55f333676366" />
<br>
관람한 경기의 티켓·예매 내역 사진을 업로드하여 직관을 등록할 수 있는 화면  
등록된 직관 정보는 출석 통계 및 승률 분석, 랭킹 산정에 활용<br>

---
### **다이어리 화면**
<img width="2408" height="2672" alt="Image" src="https://github.com/user-attachments/assets/09e14743-586c-48f8-93d3-ad85ecb36539" />
<br>
경기 관람 소감과 일상을 텍스트와 사진으로 기록할 수 있는 개인 다이어리 화면<br>

---
### **AI 경기 예측 화면**
<img width="5623" height="2964" alt="Image" src="https://github.com/user-attachments/assets/02df5148-01a6-4edf-9d8f-6b515ab33343" />
<br>
K리그 순위, 상대 팀 전적, 나의 직관 기록을 기반으로 다음 경기 결과를 예측해 주는 화면
OpenAI API를 활용하여 하루 1회 텍스트 형태의 상세 예측 리포트를 제공<br>

---
### **채팅 화면**
<img width="1469" height="740" alt="Image" src="https://github.com/user-attachments/assets/979db278-a3d0-4ac6-95ec-0ff4c5f1feec" />
<br>
다른 사용자와 1:1로 대화하며 직관 후기와 응원 메시지를 나눌 수 있는 채팅 화면<br>

---
### **프로필 화면**
<img width="1453" height="736" alt="Image" src="https://github.com/user-attachments/assets/73ea814e-0550-4b09-ba31-67fa13ecf454" />
<br>
로그아웃 및 닉네임 변경 가능한 화면<br>

---
### **관리자 출석 인증 화면**
<img width="1453" height="736" alt="Image" src="https://github.com/user-attachments/assets/37478a2d-18b3-400f-acbb-af1a3295cc81" />
<br>
사용자가 제출한 직관 인증 사진을 관리자 계정이 승인·거절할 수 있는 화면
대기 중인 요청의 경기 정보와 이미지를 확인하고 버튼 한 번으로 출석 처리 상태를 변경 가능<br>


---
### **모바일 화면**
<img width="3617" height="5152" alt="Image" src="https://github.com/user-attachments/assets/e32b1c10-59df-4ff8-9e23-6ab6873cb3c4" />
<br>
모바일 환경도 고려하여 반응형 레이아웃을 구성<br>

---
<br>

## 5. 📌 주요 기능 설계
### **Kakoa 소셜 로그인 (OAuth 2.0) 기능**
<img width="805" height="440" alt="Image" src="https://github.com/user-attachments/assets/9bf370bb-22aa-4dff-8c1f-dbf28a55b0f7" />
<br>
카카오 OAuth 2.0 기반 소셜 로그인을 통해 사용자를 인증합니다.  
직접 회원가입/비밀번호 관리 없이, 카카오 계정으로만 서비스에 접근할 수 있도록 설계했습니다.

#### ⚒️ 사용 기술 / 핵심 컴포넌트
- Spring Security OAuth2 Client
- Kakao OAuth 2.0 API
- JPA / MySQL `User` 엔티티
    - `userId` : 카카오 고유 ID (PK)
    - `nickname` : 서비스 내 표시 이름
    - `role` : 권한 정보 (`user`, `admin`)
    - `createdAt`, `lastNicknameUpdate`, `lastPredictionAt` 등 메타데이터
- 주요 클래스
    - `SecurityConfig` : OAuth2 로그인, 인가 정책 설정
    - `CustomOAuth2UserService` : 카카오 유저 정보 조회 + `User` 엔티티 저장/업데이트
    - `CustomOAuth2AuthenticationSuccessHandler` : 로그인 성공 후 리다이렉트 처리
    - `UserRepository` : 사용자 조회/랭킹 조회용 JPA 리포지토리

#### 🔐 인증 / 인가 흐름

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

이 구조를 통해  **세션 기반 인증**, **권한(role) 기반 인가**를 설계했습니다.
### 관련 소스 코드

- [SecurityConfig.java](backend/src/main/java/com/myfcseoul/backend/config/SecurityConfig.java)
- [CustomOAuth2UserService.java](backend/src/main/java/com/myfcseoul/backend/service/CustomOAuth2UserService.java)
- [CustomOAuth2AuthenticationSuccessHandler.java](backend/src/main/java/com/myfcseoul/backend/service/CustomOAuth2AuthenticationSuccessHandler.java)
- [UserRepository.java](backend/src/main/java/com/myfcseoul/backend/repository/UserRepository.java)


---

### **직관 등록**

<br>

---

### **다이어리 기능**

<br>

---

### **AI 경기 예측 기능**

<br>

---

### **채팅 기능**

<br>

---

### **랭킹 기능**

<br>

---

<br>

## 6. ⚠️ 트러블슈팅

### 1.

<br>
---

### 2. 
