---
audience: user
---
# 런타임 설정

tracked `config/*.json`에는 제품 기본값만 둔다.

## 보호 env 파일

`BISEO_ENV_FILE`로 저장소 밖의 파일을 지정한다. 기본값은 `${XDG_CONFIG_HOME:-$HOME/.config}/biseo/biseo.env`다. 파일은 `KEY=VALUE` 형식이며 따옴표·주석을 지원한다. 셸 명령이나 변수 치환은 실행하지 않는다. 파일이 없으면 기존 env로 진행한다. 파일 값이 같은 이름의 env보다 우선한다.

`SERVICE_ISSUER`·`SERVICE_AUDIENCE`는 Worker의 `SERVICE_TOKEN_ISSUER`·`SERVICE_TOKEN_AUDIENCE`와 맞춘다. 필요한 다른 운영 env도 보존한다. 파일 권한은 `600`, 상위 디렉터리는 `700`으로 제한한다. 실제 값은 문서·로그·명령 인자에 쓰지 않는다.

## 배포 전환

1. 공유 트리를 pull하기 전에 보호 파일을 준비한다. 기본 경로가 아니면 현재 셸에 `BISEO_ENV_FILE` 경로를 export한다.
2. 공유 트리를 pull한다. 보호 파일 준비 전에는 재시작하지 않는다.
3. 같은 셸에서 `pnpm release`를 실행한다. preflight와 ecosystem이 보호 파일을 직접 읽으므로 source나 하위 셸은 필요 없다.
4. `pnpm release:verify`로 확인한다.

`pm2 restart ecosystem.config.cjs`는 파일을 다시 읽는다. 이후 `pm2 restart biseo`도 PM2에 저장된 env를 유지하지만 파일 변경은 다시 읽지 않으므로 ecosystem으로 재시작한다. 필수 키 누락 시 백엔드는 키 이름만 출력하고 종료한다. 실패하면 보호 파일을 수정하고 `pnpm release`를 재실행한다.

환경 전체를 출력하지 않는다. 보호 파일과 ignored 상태 파일을 보존하며 `git clean -x`를 실행하지 않는다.
