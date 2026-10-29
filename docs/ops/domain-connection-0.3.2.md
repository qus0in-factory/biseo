---
audience: user
---
# 0.3.2 사용자 도메인 연결 준비 (`biseo.qus0in.dev`)

## Why

Worker를 기존 `biseo.qus0in.workers.dev` 외에 사용자 도메인 `biseo.qus0in.dev`로도 제공한다. DNS·도메인 변경은 사용자 확인 후에만 실행하며, 이번 문서는 승인 전 준비 결과와 실행 절차를 정리한다.

## What

- 기존 도메인 `https://biseo.qus0in.workers.dev`는 당분간 유지한다. 리디렉션·차단 없음.
- `https://biseo.qus0in.dev`를 추가 도메인으로 허용한다.
- 두 도메인 모두 Origin/CSRF 검사에서 허용한다.
- 쿠키는 기본적으로 host-only로 둔다. `COOKIE_DOMAIN`은 설정하지 않는다.
- HSTS는 Cloudflare zone/edge 정책으로 처리하고, 앱 코드에는 강제하지 않는다.
- manifest·favicon 경로는 상대 경로(`/...`)만 사용하므로 도메인에 종속되지 않는다.

## 준비 결과

### 설정

- `wrangler.jsonc` vars에 `ALLOWED_ORIGINS`를 추가했다.
  - 값: `https://biseo.qus0in.workers.dev,https://biseo.qus0in.dev`
- `COOKIE_DOMAIN`은 vars에 넣지 않았다. host-only 쿠키가 기본값이다.
- 코드에 도메인을 하드코딩하지 않았다. Origin 검사는 요청 호스트 자신의 origin과 `ALLOWED_ORIGINS` 목록을 함께 허용한다.

### Origin/CSRF

- `worker/domain/origin-guard.ts`는 요청 origin이 요청 URL origin과 같으면 허용한다.
- `ALLOWED_ORIGINS`에 나열된 origin도 허용한다.
- Origin 누락, 비정상 URL, 나열되지 않은 cross-origin은 `403 {"error":"forbidden","reason":"origin_not_allowed"}`로 거부한다.

### 쿠키 선택지

1. Host-only 쿠키(기본안, 권장)
   - 장점: 도메인별 세션이 독립적이다. workers.dev와 custom domain 세션이 섞이지 않는다. 설정이 단순하다.
   - 단점: 한 도메인에서 로그인해도 다른 도메인에서는 다시 로그인해야 한다.
2. `COOKIE_DOMAIN=biseo.qus0in.dev`
   - 장점: `*.qus0in.dev` 하위 도메인 간 쿠키를 공유할 수 있다.
   - 단점: workers.dev에는 domain 속성이 적용되지 않아 workers.dev 세션이 별도로 유지된다. 설정 실수 시 쿠키가 의도보다 넓게 공유될 수 있다. 현재 요구사항(두 도메인 모두 허용, 리디렉션 없음)에는 host-only가 더 안전하다.

### HSTS

- 권장: Cloudflare zone의 HSTS를 활성화하고 `max-age=31536000`을 사용한다.
- `includeSubDomains`와 preload는 `qus0in.dev` 전체 영향 범위를 검토한 뒤 사용자 결정으로 활성화한다.
- 앱 코드에는 HSTS 헤더를 추가하지 않는다. TLS 종료와 HSTS는 edge에서 처리한다.

### 정적 파일

- `web/index.html`과 `web/public/site.webmanifest`의 favicon/manifest 경로는 상대 경로(`/...`)만 사용한다.
- workers.dev 절대 URL은 없다.

## 사용자 결정 필요

1. 쿠키 domain 방식: host-only(권장) 또는 `COOKIE_DOMAIN=biseo.qus0in.dev`
2. `ALLOWED_ORIGINS` 저장 위치: `wrangler.jsonc` vars(현재), Cloudflare dashboard 환경변수, 또는 `.dev.vars`
3. HSTS 정책: edge max-age, `includeSubDomains`, preload 여부
4. DNS 레코드 방식: Cloudflare Custom Domain 자동 DNS 또는 수동 CNAME
5. 실제 연결 승인 시점

## 승인 뒤 실행 절차

1. 사용자 승인 기록(이슈 댓글 또는 PR).
2. `wrangler.jsonc`에 custom domain route를 추가한다. 예시:
   ```jsonc
   "routes": [
     { "pattern": "biseo.qus0in.dev", "custom_domain": true }
   ]
   ```
3. `pnpm build:client` 실행.
4. `pnpm exec wrangler deploy` 실행.
5. Cloudflare dashboard에서 DNS 레코드와 TLS 인증서 상태 확인.
6. HSTS 정책을 적용한다.
7. 검증 항목을 모두 통과한다.
8. 실패 시 롤백 절차를 실행한다.

## 검증 항목

- `https://biseo.qus0in.dev/` 접속
- 로그인 성공 및 세션 유지
- 패널 목록 조회
- SSE 연결 유지
- 메시지 전송과 응답 수신
- 미인증 `/api/health`가 `401` 반환
- workers.dev에서도 동일 동작
- 두 도메인 각각에서 Origin 불일치 요청이 `403` 반환

## 롤백

1. `wrangler.jsonc`에서 custom domain route를 제거한다.
2. `pnpm build:client && pnpm exec wrangler deploy`로 이전 상태를 재배포한다.
3. Cloudflare dashboard에서 DNS 레코드를 제거하거나 비활성화한다.
4. `https://biseo.qus0in.workers.dev` 동작을 다시 확인한다.
5. 변경 사유와 결과를 이 문서 또는 이슈에 기록한다.

## 금지 사항

- DNS 변경, custom domain/route 바인딩, `wrangler deploy`, `wrangler secret` 변경, Cloudflare API 상태 변경, push, PR, 병합은 사용자 승인 없이 실행하지 않는다.
