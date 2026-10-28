# 0.2.0 운영 기록

## 배포 결과 (2026-10-28)

- Worker: `biseo-health`
- URL: https://biseo-health.qus0in.workers.dev
- Version ID: `d6266ce0-c46a-46a8-8d7f-9226fa568c28`
- 검증: 루트 패널에서 curl로 확인했다.
  - `/`가 200을 반환했다.
  - `/api/health`가 200을 반환했고, 본문은 `{"status":"ok"}`였다.
- 미검증: 실제 브라우저에서 페이지가 렌더링되는지는 확인하지 않았다. 확인한 것은 HTML과 API의 200 응답뿐이다.
- 인증: 없음. 페이지와 `/api/health`가 모두 공개되어 있다.

## 로컬 서버와 Funnel

- PM2 실행 경로를 `dist/server/index.js`로 바꿔 다시 등록했다.
- `127.0.0.1:6543`과 Funnel `/health`가 모두 200을 반환했다.
- `pnpm typecheck`와 `pnpm build`가 통과했다. 빌드 결과물은 `dist/server`와 `dist/client`로 나뉜다.

## 명령

| 용도 | 명령 |
|---|---|
| 타입 검사 | `pnpm typecheck` |
| 빌드 | `pnpm build` (server만 빌드할 때는 `build:server`, client만은 `build:client`) |
| 로컬 서버 | `pnpm start` 또는 `pnpm pm2:start` / `pm2:restart` / `pm2:stop` |
| Worker 개발 | `pnpm dev` (client 빌드 후 `wrangler dev`) |
| Worker 배포 | `pnpm deploy` (client 빌드 후 `wrangler deploy`) |

## 설정 위치

- 로컬 서버: `config/runtime.json`. `HOST`, `PORT`, `HEALTH_STATUS` 환경변수로 덮어쓸 수 있다.
- Worker: `wrangler.jsonc`의 `vars`에 `FUNNEL_HEALTH_URL`과 `HEALTH_TIMEOUT_MS`가 있다.

## 배포 승인 경위

1. 담당 패널(opus)에서 배포 전 Funnel health가 200인지 확인했다.
2. 같은 패널에서 `wrangler deploy`를 실행하려 했지만, Claude Code 자동 권한 분류기가 `[Create Public Surface]`로 거부했다.
3. 이후 사용자의 명시적 승인에 따라 루트 패널에서 직접 배포했다.
