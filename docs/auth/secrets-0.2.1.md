# 0.2.1 Secrets 조사 — 제안만, 값 없음

대상: 이슈 #10(비밀번호·사용자 세션) · #11(서비스 토큰). 값 생성·기록·실행 없음.

## 1. Secret 이름 제안 (용도 분리) [결정 항목: 최종명 확정 필요]

- `AUTH_PASSWORD_VERIFIER` — 비밀번호 검증값 전용 (#10).
- `USER_SESSION_PASETO_SECRET` — 사용자 세션 서명 비밀키 전용 (#10).
- `SERVICE_PASETO_SECRET` — Worker→Funnel 서비스 서명 비밀키 전용 (#11).
- 근거: Secret은 암호화된 바인딩, `env`로 읽음 [Secrets](https://developers.cloudflare.com/workers/configuration/secrets/)

## 2. backend 공개 검증키 위치 [결정 항목: 경로·형식 미확정]

- backend에는 비밀키가 아닌 검증용 공개키/검증 설정만 둔다 (#11 요구).
- 제안: backend 검증키 전용 env·설정에 공개키만 보관, 비밀키 반입 금지.
- 근거: 평문 설정은 `vars`, 민감값은 Secret 사용 [Env vars](https://developers.cloudflare.com/workers/configuration/environment-variables/)

## 3. 등록·로컬 사용 계획 (본 조사에서 실행 제외)

- 배포: `wrangler secret put <KEY>` 로 각 Secret 등록 [secret put](https://developers.cloudflare.com/workers/wrangler/commands/workers/#secret-put)
- 선언 검증: `secrets.required` 선언 시 누락 경고·배포 실패 [Secrets](https://developers.cloudflare.com/workers/configuration/secrets/)
- 로컬: wrangler.jsonc와 같은 디렉토리의 `.dev.vars`(dotenv 형식), git 미커밋 [로컬 Secret](https://developers.cloudflare.com/workers/configuration/secrets/)
- 금지: `vars`·코드·문서·로그에 비밀 기록 금지 [Env vars 주의](https://developers.cloudflare.com/workers/configuration/environment-variables/)

## 4. 세션 쿠키 근거 (`Secure; HttpOnly; SameSite`, `Path=/`, 유한 `Max-Age`)

- `HttpOnly`: JS 접근 차단, XSS 탈취 완화 [Cookie HttpOnly](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/#httponly)
- `SameSite=Lax` 제안: CSRF 완화와 탐색 호환의 균형 [SameSite modes](https://developers.cloudflare.com/waf/troubleshooting/samesite-cookie-interaction/)
- `Secure`: HTTPS 전용 전송. Worker 관행 `HttpOnly; Secure; SameSite=Lax` [Worker Set-Cookie](https://developers.cloudflare.com/workers/static-assets/routing/worker-script/)
- [결정 항목]: `Lax` vs `Strict`, 만료·issuer/audience, PASETO 버전은 라이브러리 확인 후 확정 ([paseto-spec](https://github.com/paseto-standard/paseto-spec)).

## 5. 결정 항목 요약

- Secret 3종 최종명, backend 검증키 경로·형식, 쿠키 만료·교체 주기.

*값·실행 포함하지 않음. wrangler.jsonc 현행 `vars`는 공개값만 유지.*
