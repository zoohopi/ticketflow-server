# TICKETFLOW Server

Supabase `performances` 테이블을 관리하는 Express API 서버입니다.

## 실행 방법

```bash
npm install
# .env.example을 복사해 .env를 만들고 값 입력
npm run dev
```

## 환경 변수

| 이름 | 설명 |
| --- | --- |
| PORT | 서버 포트 (기본 3001) |
| SUPABASE_URL | Supabase 프로젝트 URL |
| SUPABASE_SERVICE_ROLE_KEY | Supabase 서버 전용 키 |
| ADMIN_API_KEY | 데이터 변경 API 접근용 비밀값 |

## API

| Method | URL | 설명 | 인증 |
| --- | --- | --- | --- |
| GET | /performances | 공연 목록 조회 (id 오름차순) | - |
| POST | /performances | 공연 등록 | x-admin-key |
| PATCH | /performances/:id | 공연 수정 (전달된 항목만) | x-admin-key |
| DELETE | /performances/:id | 공연 삭제 | x-admin-key |

## 배포

Render Web Service — Build `npm install`, Start `npm start`
