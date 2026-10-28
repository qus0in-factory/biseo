# 0.1.0 실행·확인

## Why

브라우저 또는 REST 클라이언트에서 외부 `/health`에 접속해 HTTP 200을 받는다. 인증은 다음 단계다.

## What

- 서버: Hono + Node.js, pnpm 의존성 관리
- 프로세스: PM2 `biseo`
- 로컬: `http://127.0.0.1:6543/health`
- 공개: `https://youngins-mac-mini.taild60edd.ts.net/health`
- 응답: 인증 없이 HTTP 200, `{"status":"ok"}`
- 변경 가능한 기본값: `config/runtime.json`, 환경변수 `HOST`, `PORT`, `HEALTH_STATUS`, `PROCESS_NAME`

## How

프로젝트 디렉터리에서 실행한다.

```sh
pnpm install --frozen-lockfile
pnpm pm2:start
pnpm pm2:restart
curl -i http://127.0.0.1:6543/health
curl -i https://youngins-mac-mini.taild60edd.ts.net/health
pnpm pm2:stop
```

이 Mac의 Tailscale CLI는 `/Applications/Tailscale.app/Contents/MacOS/Tailscale`이다. 실제 확인한 버전은 1.102.4다.

```sh
/Applications/Tailscale.app/Contents/MacOS/Tailscale funnel status --json
/Applications/Tailscale.app/Contents/MacOS/Tailscale funnel --bg --https=443 http://127.0.0.1:6543
/Applications/Tailscale.app/Contents/MacOS/Tailscale funnel --https=443 off
```

### 확인 결과 (2026-10-28)

- PM2 `biseo` online과 로컬 6543의 HTTP 200을 확인했다.
- biseo만 PM2로 재시작한 뒤에도 health가 복구됨을 확인했다.
- 기존 Serve/Funnel 설정이 비어 있음을 확인한 후 443을 연결했다.
- 공개 DNS에서 확인한 글로벌 IP로 TLS 호스트명을 유지해 직접 연결했고 HTTP 200과 최소 JSON 응답을 확인했다. 웹 검색 도구는 해당 URL을 읽지 못했지만 REST 요청은 성공했다.
- 다른 PM2 앱은 변경하지 않았다. 인증·워커 API·OS 부팅 자동기동은 구현하지 않았다.

이전 인증·상세 수용 문서는 향후 참고 기록이며 현재 목표가 아니다. 현재 이슈·릴리스 범위는 [백로그](backlog.md), 승격 절차는 [개발 흐름](development.md)을 따른다.
