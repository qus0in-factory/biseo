# 0.2.0 서버 TS 및 배포 설정 독립 리뷰

## Why
Claude Opus 작성 서버 TS 소스와 sol 작성 배포 설정(Vite·tsconfig·Wrangler)의 0.1 기능 유지·빌드 경로·PM2/정적 자산 정합성을 검토한다.

## What

### 1. 판정 결과: 전원 통과 (Pass)
- **0.1 무인증 health 유지**: `src/index.ts`에서 `/health` 200 반환 로직 정상 보존.
- **컴파일/배포 경로 일치**:
  - 서버 TS(`tsconfig.server.json`) -> `dist/server`
  - 클라이언트(`vite.config.ts`) -> `dist/client`로 명확히 분리됨.
- **PM2 실행 설정**: `ecosystem.config.cjs`가 `dist/server/index.js`와 `cwd: __dirname`을 지정하여 컴파일 산출물과 정합성 일치 (구 프로세스 교체 진행 중).
- **정적 자산 및 API 라우팅**: `wrangler.jsonc`에 `assets.directory: dist/client`, `run_worker_first: ["/api/*"]`, vars(`FUNNEL_HEALTH_URL`) 완결 매핑.
- **모듈 크기**: 전 모듈 20줄/500자 이내로 128줄/1024자 상한 완벽 충족.

### 2. 수정 필요 (Needs Revision)
- 명백한 차단성 결함 없음.

### 3. 미확인 (Unconfirmed)
- Cloudflare Pages/Worker 실제 원격 배포 및 라이브 통신 (배포·원격 실행 금지 준수).

## How
1. sol의 PM2 프로세스 교체(delete/start) 및 Worker 빌드·배포 완료 후 통합 종료.
