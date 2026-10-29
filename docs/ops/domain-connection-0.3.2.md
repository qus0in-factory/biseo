---
audience: user
---
# 0.3.2 사용자 도메인 연결 준비 (`biseo.qus0in.dev`)

## Why

Worker를 기존 `biseo.qus0in.workers.dev` 외에 사용자 도메인 `biseo.qus0in.dev`로도 제공한다. DNS·도메인 변경은 사용자 확인 후에만 실행하며, 이번 문서는 승인 전 준비 결과와 실행 절차를 정리한다.

## 확정된 결정

1. 커스텀 도메인은 CLI로 연결한다. `wrangler.jsonc`의 `routes`에 아래 항목을 선언하고 `wrangler deploy`로 적용한다.
   ```jsonc
   "routes": [
     { "pattern": "biseo.qus0in.dev", "custom_domain": true }
   ]
   ```
2. `workers.dev` 주소는 그대로 유지한다. 리디렉션·차단 없음.
3. 세션 쿠키는 host-only로 발급한다. `Domain` 속성을 사용하지 않는다(`COOKIE_DOMAIN` 미설정).
4. 허용 Origin은 `wrangler.jsonc` vars의 `ALLOWED_ORIGINS`에 둔다. `https://biseo.qus0in.workers.dev`와 `https://biseo.qus0in.dev` 두 개를 넣는다. 목록이 비면 same-origin만 허용하고 cross-origin은 거부한다.
5. HSTS는 `max-age=300`부터 시작해 단계적으로 올린다. `includeSubDomains`는 사용하지 않는다.
6. 배포는 0.3.1 릴리스와 함께 한다. 기존 승인 대기 단계는 릴리스 절차의 한 항목으로 정리한다.

## What

- 기존 도메인 `https://biseo.qus0in.workers.dev`는 유지한다. 리디렉션·차단 없음.
- `https://biseo.qus0in.dev`를 추가 도메인으로 허용한다.
- 두 도메인 모두 Origin/CSRF 검사에서 허용한다.
- 쿠키는 host-only로 둔다. `COOKIE_DOMAIN`은 설정하지 않는다.
- HSTS는 edge에서 `max-age=300`부터 시작해 단계적으로 올린다. `includeSubDomains`는 사용하지 않는다. 앱 코드에는 강제하지 않는다.
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

### 쿠키

결정에 따라 host-only를 사용한다. 비교는 참고용이다.

1. Host-only 쿠키(결정됨, 권장)
   - 장점: 도메인별 세션이 독립적이다. workers.dev와 custom domain 세션이 섞이지 않는다. 설정이 단순하다.
   - 단점: 한 도메인에서 로그인해도 다른 도메인에서는 다시 로그인해야 한다.
2. `COOKIE_DOMAIN=biseo.qus0in.dev`(미사용)
   - 장점: `*.qus0in.dev` 하위 도메인 간 쿠키를 공유할 수 있다.
   - 단점: workers.dev에는 domain 속성이 적용되지 않아 workers.dev 세션이 별도로 유지된다. 설정 실수 시 쿠키가 의도보다 넓게 공유될 수 있다. 현재 요구사항(두 도메인 모두 허용, 리디렉션 없음)에는 host-only가 더 안전하다.

### HSTS

- edge에서 HSTS를 활성화하고 `max-age=300`부터 시작해 단계적으로 올린다.
- `includeSubDomains`는 사용하지 않는다. preload는 `qus0in.dev` 전체 영향 범위를 검토한 뒤 사용자 결정으로 활성화한다.
- 앱 코드에는 HSTS 헤더를 추가하지 않는다. TLS 종료와 HSTS는 edge에서 처리한다.

### 정적 파일

- `web/index.html`과 `web/public/site.webmanifest`의 favicon/manifest 경로는 상대 경로(`/...`)만 사용한다.
- workers.dev 절대 URL은 없다.

## 릴리스 절차 (0.3.1과 함께)

1. 릴리스 절차의 한 항목으로 이 도메인 연결 승인을 기록한다(이슈 댓글 또는 PR).
2. `wrangler.jsonc`에 custom domain route를 추가한다(위 syntax).
3. `pnpm build:client` 실행.
4. `pnpm exec wrangler deploy` 실행.
5. Cloudflare dashboard에서 DNS 레코드와 TLS 인증서 상태 확인.
6. HSTS를 `max-age=300`으로 적용한 뒤 단계적으로 올린다.
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

- 사용자 승인 없이 DNS 변경, custom domain/route 바인딩, `wrangler deploy`, `wrangler secret` 변경, Cloudflare API 상태 변경, push, PR, 병합을 실행하지 않는다. 단, 릴리스 절차 내에서 승인된 항목으로 실행하는 것은 허용한다.
