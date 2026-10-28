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
   - `pnpm pm2:restart` 후 `pm2 status`에서 `biseo` online 확인.
   - `curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:6543/health`
   - `curl -s -o /dev/null -w '%{http_code}\n' https://youngins-mac-mini.taild60edd.ts.net/health`
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
