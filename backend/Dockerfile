FROM eclipse-temurin:17-jre-alpine

# ① Chromium & Chromedriver 설치
RUN apk update && \
    apk add --no-cache \
      chromium \
      chromium-chromedriver

# ② Selenium이 사용할 바이너리 경로 설정
ENV CHROME_BIN=/usr/bin/chromium-browser \
    CHROME_DRIVER=/usr/bin/chromedriver

WORKDIR /app

# ③ 빌드된 JAR 복사
COPY build/libs/*.jar app.jar

EXPOSE 8080

# ④ Chromedriver 경로를 JVM 옵션으로 전달
ENTRYPOINT ["sh","-c","java -Dwebdriver.chrome.driver=${CHROME_DRIVER} -jar app.jar"]
