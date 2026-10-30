---
audience: user
---
# 0.2.1 반영 운영 절차 (승인용, 값·실행 없음)

참조: [decisions](decisions-0.2.1.md) · [secrets](auth/secrets-0.2.1.md) · `config/runtime.json`. 실제 비밀은 문서·로그·명령 인자에 쓰지 않는다.

1. **키·검증값 생성** [승인 필요]
   - 세션·서비스 PASETO 키쌍은 공식 도구/WebCrypto로 CSPRNG 생성, 비밀번호 검증값은 `PasswordVerifier` 구현의 도구로 생성.
   - 출력은 터미널에 표시하지 않고 600 보호 파일로 저장, 완료 후 삭제.
2. **Worker Secret 등록** [승인 필요]
   - `wrangler secret put` 대상: `AUTH_PASSWORD_VERIFIER`, `USER_SESSION_PASETO_SECRET`, `SERVICE_PASETO_SECRET` (최종명은 decisions #1).
   - 값은 보호 파일 stdin으로 입력, `vars`·코드 기록 금지.
3. **backend 공개 검증키** [승인 필요]
   - 서비스 공개키만 `servicePublicKeyPath`(`config/service-public.key`)에 배치, 권한 600, git 제외. 비밀키 반입 금지.
4. **배포 순서** [승인 필요]
   - 권장: backend 먼저(공개키+검증 로직, 기존 `/health` 무인증 유지 여부 확인) → Worker.
   - 위험: Worker 먼저면 토큰을 붙인 요청을 backend가 거부해 health 중단. backend 먼저면 토큰 없는 기존 요청이 거부될 수 있음.
   - 완화: backend 검증을 단계 전환(토큰 없는 요청 임시 허용 후 Worker 반영 뒤 강제), 사이 구간 최소화.
5. **재시작·검증** (비밀 미노출, 상태코드만)
   - 재배포는 `pnpm release`(clean 빌드→preflight→PM2 재시작)로 실행한다.
   - `pm2 status`에서 `biseo` online 확인.
   - `curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:6543/health`
   - `curl -s -o /dev/null -w '%{http_code}\n' https://<device>.<tailnet>.ts.net/health`
   - Worker: `curl -s -o /dev/null -w '%{http_code}\n' <Worker URL>/api/health` (기대: 200, 토큰·쿠키 출력 금지).
6. **롤백** [승인 필요]
   - Worker를 직전 버전으로 되돌린 뒤 backend를 이전 커밋으로 `pnpm pm2:restart`.
   - 키 유출 의심 시 키쌍 재생성·`secret put` 교체, 5번 재검증.

## 반영 결과 (2026-10-28)

- Worker `biseo` 배포: Version `743d2824-f61e-42f4-9576-2bdf79b4e1c4`, Secret 3종 등록 확인
- 검증: `/` 200, 미로그인 `/api/health` 401, 브라우저 로그인 후 health 표시(사용자 확인)
- backend: PM2 `biseo` online(`dist/server/src/index.js`), Funnel 직접 `/health` 401(토큰 없는 접근 거부)
- 기존 Worker `biseo-health` 삭제
- 비밀번호 검증값은 `!` 모드에서 입력 불가하여 별도 터미널 스크립트로 생성

## 0.2.2 반영 (2026-10-28)

- Worker Version `826a8cf1-d47a-4036-9cab-c354e3680031`
- `FUNNEL_HEALTH_URL`을 vars에서 Secret으로 이관. 기존 vars 바인딩과 이름이 겹쳐 secret put이 거부되어(code 10053) 배포 후 등록
- 검증: `/` 200, 미로그인 `/api/session`·`/api/health` 401
- 문제: Workers Rate Limiting(5회/60초)이 연속 18회 실패에도 429를 반환하지 않음

## 0.2.3 반영 (2026-10-28)

- Worker Version `4bf62684-f0a4-4291-97c8-5337a3c5314a`, KV `LOGIN_ATTEMPTS`로 실패 제한 교체
- 검증: 연속 실패 `401 ×5` 후 `429`, `/` 200, 미로그인 401
- 한계: KV 최종 일관성으로 동시 요청 시 소폭 초과 가능. 시험 후 해당 IP는 약 60초 차단
