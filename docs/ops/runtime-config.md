---
audience: user
---
# 런타임 설정

## 파일과 환경값

`config/*.json`에는 제품 기본값만 둔다. 환경값은 env와 자동 결정으로 처리한다. 파일 복사로 운영 설정을 만들지 않는다.

`SERVICE_ISSUER`·`SERVICE_AUDIENCE`는 Worker의 `SERVICE_TOKEN_ISSUER`·`SERVICE_TOKEN_AUDIENCE`와 맞춘다. `agyCliTimeoutMs`는 CLI 로더가 읽는 제품 기본값으로 유지한다.

## 배포 전환

공유 트리가 pull하기 전에 다음 순서로 진행한다. 실제 값은 문서·로그·명령 인자에 쓰지 않는다.

1. 저장소 밖의 보호된 env 파일에 두 env 키를 넣는다. 파일 권한은 `0600`, 상위 디렉터리는 `0700`으로 제한한다.
2. 셸 추적을 끈 하위 셸에서 보호 파일을 읽어 PM2 환경을 갱신한다. `PROTECTED_ENV_FILE`은 해당 파일 경로다.

```sh
(
  set +x
  set -a
  . "$PROTECTED_ENV_FILE"
  set +a
  test -n "$SERVICE_ISSUER" && test -n "$SERVICE_AUDIENCE" || exit 1
  pm2 restart biseo --update-env
)
```

3. 재시작 성공을 확인한 뒤 공유 트리를 pull한다.
4. `pnpm release` 후 `pnpm release:verify`로 확인한다.

환경 전체를 출력하는 명령은 사용하지 않는다. 보호 파일과 ignored 상태 파일을 보존하며 `git clean -x`를 실행하지 않는다.
