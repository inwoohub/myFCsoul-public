# 1) React 빌드 스테이지
FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 2) Nginx를 이용한 정적 호스팅 스테이지
FROM nginx:stable-alpine

# React 빌드 결과물을 nginx html 디렉터리에 복사
COPY --from=builder /app/build /usr/share/nginx/html

# 커스텀 Nginx 설정 파일 복사
# (빌드 컨텍스트에 default.conf 파일이 있어야 합니다)
COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
