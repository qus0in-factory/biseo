---
audience: user
---

# 현행 실행·검증·배포

이 문서는 현재 코드의 운영 기준이다. [이전 운영 기록](../operations-0.4.0.md)은 당시 이력으로 보존하며, 그 명령을 현재 환경에 그대로 적용하지 않는다. 정식 릴리스 v0.5.4와 이후 main 수정·운영 배포는 구분한다.

## 실행과 검사

Node.js 24 이상, pnpm 11.24.0을 사용한다. Herdr가 실행 중이어야 하며 백엔드는 서비스 검증키, Worker는 인증 시크릿·D1·KV 바인딩과 백엔드 연결 설정이 필요하다.

```sh
pnpm install --frozen-lockfile
pnpm test
pnpm typecheck
pnpm build
```

기존 검사는 984개다. `pnpm start`는 빌드된 백엔드를 실행하고, `pnpm dev`는 클라이언트 빌드 후 로컬 Worker를 실행한다. 새 테스트·CI·의존성 추가는 별도 요청 범위다.

## 설정을 보존하는 경계

- `config/`에는 Git으로 관리하는 공유 기본값도 있다. 디렉터리 전체를 비밀 파일로 간주하거나 운영 파일 전체를 덮어쓰지 않는다.
- 백엔드는 실행 cwd의 `config/runtime.json`과 지원되는 환경변수로 설정을 읽는다. 공개 서비스 검증키 경로도 실행 환경에 맞춰 준비한다.
- `config/session.json`은 클라이언트 빌드 입력이다. 운영 오버라이드가 있다면 새 빌드에서도 그 유효 설정을 보존하고, 저장소 기본값으로 몰래 되돌리지 않는다.
- 워크스페이스 선택 상태와 보호된 키·시크릿은 코드 배포와 구분한다. 개인키·토큰·비밀번호·PIN을 출력·복사·커밋하지 않는다.
- PM2 상태 조회는 이름·PID·cwd·스크립트·상태 등 필요한 필드만 기록한다. 전체 환경변수 출력을 로그로 남기지 않는다.

## dev와 main

작업 브랜치에서 기존 검사·타입 검사·빌드·타계열 리뷰를 확인하고 로컬 dev에 통합한다. dev push의 CI 성공 후 dev→main PR을 만들고 보호 규칙을 통과해 병합한다. 별도 승인 없이 버전 번호·태그·릴리스를 만들지 않는다.

## 백엔드 배포

1. 현재 PM2 앱의 cwd·스크립트·PID와 진행 중 턴·큐를 확인한다. 사용자 설정이나 미커밋 변경은 보존한다.
2. 검증된 커밋의 깨끗한 소스로 빌드하고 설정·검증키를 준비한다. `pnpm preflight`로 부팅 설정을 검사한다.
3. 승인된 대상 `biseo`만 재시작하고 PID 변경·online 상태·새 오류·인증 응답을 확인한다. 다른 앱 종료나 PM2 자체 업데이트는 하지 않는다.
4. 무인증 로컬 `/health`는 401, 유효한 서비스 토큰을 직접 주입한 요청은 200인지 확인한다. 토큰 값은 출력하지 않는다.

#213에서는 기존 배포와 새 빌드의 서버 산출물 374개 중 변경 모듈 1개만 달라 해당 산출물을 백업·원자 교체하고 기존 cwd·환경을 유지해 재시작했다. 이는 기록된 한시적 artifact 배포다. 옛 release worktree에서 전체 빌드를 다시 하면 수정이 덮일 수 있으므로, 후속 배포는 수정이 포함된 main 소스를 기준으로 한다. [부검·배포 근거](postmortem-213-agy-model.md)를 참고한다.

## Worker와 화면 배포

백엔드 재시작만으로 브라우저 화면은 갱신되지 않는다. 클라이언트 빌드와 Worker 배포를 별도로 수행한다. 기존 Worker 시크릿·바인딩·운영 클라이언트 설정을 보존하고, `/` 200·미인증 `/api/health` 401 및 변경 화면을 실제 도메인에서 확인한다. PIN·비밀번호를 검증용 로그에 남기지 않는다.

## 관측과 데이터

- 모델 관측: [pane-model-observe.ts](../../src/app/pane-model-observe.ts)는 OpenCode의 `recent-unwrapped`, AGY의 `visible` 상태줄을 읽는다. 캐시는 [pane-model-cache.ts](../../src/app/pane-model-cache.ts)에서 관리한다. 응답 수집·사용량 수집과는 별도다.
- 읽기 전용 effort 표시는 [#214 제안](https://github.com/qus0in-factory/biseo/issues/214)이며 미구현이다.
- API 정의: [Worker 라우트 등록](../../worker/ui/routes-registry.ts), [백엔드 라우트 등록](../../src/ui/app-routes.ts). 경로·메서드를 이름으로 추정하지 않는다.
- D1 스키마는 [마이그레이션](../../worker/migrations/)을 기준으로 한다. 작업 데이터의 소유자·workspace 범위와 인증·사용량·동기화 데이터의 범위는 서로 다르다.

관련: [README](../../README.md) · [개발·승격](../development.md) · [Wiki](https://github.com/qus0in-factory/biseo/wiki).
