---
audience: user
---
# 0.2.1 배포 실행 목록 (사용자 실행)

- 모든 명령은 `~/Factory/biseo`에서 실행한다.
- 비밀 값은 보호 파일(`~/.config/biseo/secrets`, 권한 600)에서만 읽는다.
- 운영 배경은 [operations-0.2.1](operations-0.2.1.md)을 참조한다.

## 1. 비밀번호 검증값 생성

비밀번호는 12자 이상이어야 하며, 입력 내용은 화면에 표시되지 않는다.

이 단계는 `read`로 입력을 받기 때문에 Claude Code의 `!` 모드에서는 동작하지 않는다. 별도의 터미널 창에서 실행한다.

```sh
bash /tmp/biseo-tools/make-verifier.sh
```

## 2. 백엔드 전환

마지막 명령의 결과가 `401`이면 정상이다. 이 단계부터 3번이 끝날 때까지 Funnel `/health`는 401을 반환하므로 3번을 바로 이어서 실행한다.

```sh
pm2 delete biseo && pm2 start ecosystem.config.cjs && pm2 save
curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:6543/health
```

## 3. Worker 배포와 Secret 등록

```sh
S=~/.config/biseo/secrets
pnpm exec wrangler deploy
pnpm exec wrangler secret put AUTH_PASSWORD_VERIFIER < $S/password.verifier
pnpm exec wrangler secret put USER_SESSION_PASETO_SECRET < $S/user-session.secret
pnpm exec wrangler secret put SERVICE_PASETO_SECRET < $S/service.secret
```

## 4. 검증

출력이 `/ 200`, `/api/health 401`이면 정상이다.

```sh
for p in / /api/health; do curl -s -o /dev/null -w "$p %{http_code}\n" https://biseo.qus0in.workers.dev$p; done
```

이어서 브라우저로 https://biseo.qus0in.workers.dev 에 로그인한다. 로그인 후 health가 표시되면 Worker → 백엔드 → Funnel 연결 전체가 정상이다.

## 5. 기존 Worker 삭제 (4번 확인 후, 되돌릴 수 없음)

```sh
pnpm exec wrangler delete --name biseo-health
```

## 롤백

- 백엔드: 아래 명령으로 0.2.0으로 되돌린다.

  ```sh
  git stash -u && pnpm build:server && pm2 delete biseo && pm2 start ecosystem.config.cjs
  ```

- Worker: `pnpm exec wrangler rollback`으로 되돌린다.

## 결정 대기

- `wrangler.jsonc`의 vars에 실제 tailnet 호스트명이 평문으로 들어 있다. 공개 저장소에 그대로 둘지 결정해야 한다.
