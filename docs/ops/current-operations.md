---
audience: user
---

# 현행 실행·검증·배포

이 문서는 현재 코드의 운영 기준이다. [이전 운영 기록](../operations-0.4.0.md)은 당시 이력으로 보존하며, 그 명령을 현재 환경에 그대로 적용하지 않는다. 현재 릴리스 준비 기준은 [v0.6.5](../release/0.6.5-notes.md)이며, 정식 릴리스 발행과 운영 배포는 구분한다.

## 실행과 검사

Node.js 24 이상, pnpm 11.24.0을 사용한다. Herdr가 실행 중이어야 하며 백엔드는 서비스 검증키, Worker는 인증 시크릿·D1·KV 바인딩과 백엔드 연결 설정이 필요하다.

```sh
pnpm install --frozen-lockfile
pnpm test
pnpm typecheck
pnpm build
```

검사 수는 대상 커밋의 실행 결과를 기준으로 한다. `pnpm start`는 빌드된 백엔드를 실행하고, `pnpm dev`는 클라이언트 빌드 후 로컬 Worker를 실행한다. 새 테스트·CI·의존성 추가는 별도 요청 범위다.

## 설정을 보존하는 경계

- `config/`에는 Git으로 관리하는 공유 기본값도 있다. 디렉터리 전체를 비밀 파일로 간주하거나 운영 파일 전체를 덮어쓰지 않는다.
- 백엔드는 실행 cwd의 `config/runtime.json`과 지원되는 환경변수로 설정을 읽는다. 공개 서비스 검증키 경로도 실행 환경에 맞춰 준비한다.
- `config/session.json`은 클라이언트 빌드 입력이다. 운영 오버라이드가 있다면 새 빌드에서도 그 유효 설정을 보존하고, 저장소 기본값으로 몰래 되돌리지 않는다.
- 워크스페이스 선택 상태와 보호된 키·시크릿은 코드 배포와 구분한다. 개인키·토큰·비밀번호·PIN을 출력·복사·커밋하지 않는다.
- PM2 상태 조회는 이름·PID·cwd·스크립트·상태 등 필요한 필드만 기록한다. 전체 환경변수 출력을 로그로 남기지 않는다.

## 워크스페이스 선택

백엔드는 실행 cwd의 `config/workspace-selection.json`에 유효한 선택이 있으면 `runtime.json`의 `allowedWorkspaceId`보다 우선해 사용한다. 선택 파일은 gitignore 대상이며 배포 기본값으로 덮어쓰거나 커밋하지 않는다. `runtime.json`만 바꿔서는 기존 선택이 바뀌지 않는다.

워크스페이스를 바꿀 때는 인증된 화면의 워크스페이스 탭이나 설정의 선택 목록을 사용한다. 백엔드의 `POST /herdr/workspaces/select`가 감지된 ID를 확인한 뒤 선택 파일에 `{"workspaceId":"<선택한 ID>"}`를 저장한다. API를 직접 사용할 때도 기존 인증 경로를 사용하고 토큰을 로그에 남기지 않는다.

장애로 화면을 사용할 수 없으면 실제 PM2 cwd를 먼저 확인하고, 그 cwd의 선택 파일만 같은 JSON 형식으로 갱신한다. 기존 설정·권한을 보존하고 Herdr에 존재하는 ID인지 확인한다. 선택은 요청 시 다시 읽으므로 이 변경만으로 PM2를 재시작하지 않는다. 이후 인증된 `/herdr/config` 응답과 해당 workspace 접근을 확인한다. 단순 오류 로그 소멸만으로 전체 정상화를 단정하지 않는다.

## dev와 main

작업 브랜치에서 기존 검사·타입 검사·빌드·타계열 리뷰를 확인하고 로컬 dev에 통합한다. dev push의 CI 성공 후 dev→main PR을 만들고 보호 규칙을 통과해 병합한다. 별도 승인 없이 버전 번호·태그·릴리스를 만들지 않는다.

## 백엔드 배포

PM2 `biseo`는 `/Users/young-mini/Factory/biseo` 체크아웃에서만 실행한다. 개발·검증용 worktree를 서비스 cwd로 사용하지 않는다. worktree 정리 전에는 실행 중 프로세스의 cwd도 확인한다. [#222 부검](https://github.com/qus0in-factory/biseo/issues/222)과 로컬 `Factory/docs/harness/postmortem-worktree-prune-biseo.md`가 근거다.

1. 현재 PM2 앱의 cwd·스크립트·PID와 진행 중 턴·큐를 확인한다. 사용자 설정이나 미커밋 변경은 보존한다.
2. 검증된 커밋의 깨끗한 소스로 빌드하고 설정·검증키를 준비한다. `pnpm preflight`로 부팅 설정을 검사한다.
3. 승인된 대상 `biseo`만 재시작하고 PID 변경·online 상태·새 오류·인증 응답을 확인한다. 다른 앱 종료나 PM2 자체 업데이트는 하지 않는다.
4. 무인증 로컬 `/health`는 401, 유효한 서비스 토큰을 직접 주입한 요청은 200인지 확인한다. 토큰 값은 출력하지 않는다.

#213에서는 기존 배포와 새 빌드의 서버 산출물 374개 중 변경 모듈 1개만 달라 해당 산출물을 백업·원자 교체하고 기존 cwd·환경을 유지해 재시작했다. 이는 기록된 한시적 artifact 배포다. 옛 release worktree에서 전체 빌드를 다시 하면 수정이 덮일 수 있으므로, 후속 배포는 수정이 포함된 main 소스를 기준으로 한다. [부검·배포 근거](postmortem-213-agy-model.md)를 참고한다.

## Worker와 화면 배포

백엔드 재시작만으로 브라우저 화면은 갱신되지 않는다. 클라이언트 빌드와 Worker 배포를 별도로 수행한다. 기존 Worker 시크릿·바인딩·운영 클라이언트 설정을 보존하고, `/` 200·미인증 `/api/health` 401 및 변경 화면을 실제 도메인에서 확인한다. PIN·비밀번호를 검증용 로그에 남기지 않는다.

릴리스는 `pnpm release:all`로 `pnpm release`(서버 빌드·PM2 재시작), `pnpm deploy`(vite build·wrangler deploy), `pnpm release:verify`(운영 번들 버전과 package.json 비교, URL은 `config/release-verify.json`)를 순서대로 실행한다. 화면 푸터 버전도 눈으로 확인한다. 화면 버전은 `vite.config.ts`에서 빌드 시 번들에 들어가므로 `pnpm release`만으로는 바뀌지 않는다. 2026-11-07 v0.6.0에서 `pnpm deploy`를 빠뜨려 운영 화면이 0.5.4로 남았다.

## 사용량 수집과 복구

2026-11-07 [PR #230](https://github.com/qus0in-factory/biseo/pull/230)이 main `5cdb862`에 병합됐다. 아래는 #227·#228·#229의 코드 동작이며, 병합 사실만으로 운영 배포나 인증된 사용량 회복을 보증하지 않는다.

### Grok

- 매 조회마다 OpenCode DB의 `xai` access 자격증명만 읽는다. 메모리 토큰 우선 경로와 refresh 요청·DB 쓰기를 없앴다. DB가 갱신되면 다음 조회에서 읽으며, access가 없으면 billing HTTP 요청을 보내지 않는다.
- 자격증명 없음·HTTP 401/403은 `auth_required`, 네트워크·timeout·429·그 밖의 비정상 HTTP는 `temporarily_unavailable`, JSON·필드 형식 오류는 `schema_error`로 나눈다. 일시 장애나 형식 오류를 재인증 필요로 안내하지 않는다.
- 실패 때 직전 수치와 성공 `checkedAt`을 보존하더라도 현재 상태는 `unknown`이다. 과거 값은 새 조회 성공이나 사용 가능의 근거가 아니다. 로그에는 provider·stage·status·reason만 남기고 토큰·헤더·응답 원문은 남기지 않는다.
- upstream `currentPeriod.type`의 WEEKLY는 `w`, MONTHLY는 `m`, 누락·알 수 없는 값은 `primary`다. `primary`를 월간으로 강제 표시하지 않는다. 유효한 `billingPeriodStart`는 `startsAt`으로 전달하며 없는 5h·주간 창을 추정하지 않는다.

### Claude

- 429는 `rate_limited` 안내와 `retryAt`을 보낸다. `config/claude-oauth.json` 기본 백오프는 1분 시작·2배 증가·최대 15분이다. 숫자 초·HTTP-date `retry-after`와 지수 백오프 중 큰 값을 쓰되 최대값으로 제한한다. 게이트가 열려 있으면 upstream 호출을 생략하고 성공하면 백오프를 초기화한다.
- 성공한 사용량만 `snapshotPath` 기본값 `data/claude-usage.json`에 원자적 rename으로 저장한다. `BISEO_CLAUDE_SNAPSHOT_PATH`로 위치를 바꿀 수 있다. 기본 경로는 실행 cwd 기준이며 디렉터리 0700·파일 0600이다. 토큰·응답 원문은 저장하지 않으며 디스크 실패가 정상 API 응답을 실패로 바꾸지 않는다.
- 재시작 뒤에도 유효한 직전값을 읽는다. 429·백오프·기타 조회 실패 때는 `claude-stale`, `state: unknown`으로 표시하고 실패 reason·retryAt은 현재 결과, `checkedAt`은 원래 성공 시각을 유지한다. D1 복원에도 같은 만료 기준을 적용한다.
- 직전값의 수명은 고정 TTL이 아니라 창별 `resetsAt`까지다. reset이 만료·누락·잘못된 창은 복원하지 않는다. 백오프 카운터 자체는 메모리라 재시작 시 초기화된다. 유료 `claude -p` 폴백은 구현하지 않았다.
- 배포 시 스냅샷 경로·권한·보존 여부를 확인한다. 외부 경로를 지정했다면 Git 제외·백업도 운영자가 확인한다. 토큰이나 실제 사용량 파일을 문서·저장소에 복사하지 않는다.

### 새로고침과 확인

사용량 모달의 제공자 설정 옆 새로고침은 기존 조회 경로를 다시 실행한다. 로딩·요청 중에는 비활성화하고 스피너를 표시하며, 요청 종료 뒤 `web/usage-config.json`의 `refreshCooldownMs`(기본 10000ms) 동안 연타를 막는다. 이 버튼은 Claude 백오프를 우회하거나 인증을 갱신하지 않는다. 비-auth 실패에는 일시 장애·응답 형식 오류와 확인 가능한 최근 성공 시각을 표시한다.

운영 확인은 인증된 사용량 응답의 reason·성공 시각·창 만료를 대조한다. PM2 online이나 재시작 성공만으로 회복을 선언하지 않는다. 테스트는 임시 스냅샷·합성 응답을 사용하며 실제 계정 자격증명에 기대는 네트워크 호출을 검증 근거로 삼지 않는다.

### AGY 조사와 한계

[#231](https://github.com/qus0in-factory/biseo/issues/231) 해결: 기본 호스트를 `daily-cloudcode-pa.googleapis.com`으로 바꿨고 `BISEO_AGY_HOST`로 설정한다. 같은 시각 호스트 대조에서 `cloudcode-pa`는 Gemini 5h·w가 모두 1이었고 `daily-cloudcode-pa`는 5h 90.03%·w 96.91%로 CLI `/quota`와 일치했다. `BISEO_AGY_USAGE_URL`·`BISEO_AGY_QUOTA_URL`을 지정하면 호스트 설정보다 우선한다. `pace` 눈금은 시간 비율이지 두 번째 할당량이 아니다.

quota API의 모델 버킷(`gemini-2.5-pro` 등)은 식별자에 `week`가 없으면 5h 창으로 라벨한다. 근거는 위 #231 실측이다. 같은 시각 `daily-cloudcode-pa`의 모델 버킷 잔여율은 CLI `/quota`의 Gemini 5h 값과 일치했고, 모델 버킷의 reset 시각은 조회 시점 기준 당일 안이었으며 주간 할당은 `gemini-argon-wtu-weekly` 버킷으로 따로 왔다. 이 가정은 `src/infra/agy-quota-group.ts`에 있으며, 같은 풀에 주간·5h 버킷이 함께 오면 창별로 따로 요약하고 최솟값을 섞지 않는다. API가 창 종류를 바꾸면 이 문단과 코드를 함께 고친다.

리뷰 P2(병합 우선순위, CLI 폴백 `/quota` 파싱, 풀 매핑 등)는 [#232](https://github.com/qus0in-factory/biseo/issues/232)에서 추적한다. 운영 화면 실측은 배포 뒤 확인한다. 2026-11-07 agy 1.5.2에서 `agy -p /quota`와 `agy -p /usage`를 각각 1회 실행했다. 두 실행 모두 print-mode 슬래시 명령 로그가 있었고, `generateContent`·`streamGenerateContent`는 각각 0회였다. `/quota`는 5.365초, `/usage`는 5.237초에 종료 코드 0을 반환했다. 두 출력은 Argon 주간 행을 포함한 5행·4열 TSV였으며, 기존 파서와 주간 보충 함수로 처리됐다. 사용량 수치·토큰·출력 원문은 기록하지 않았다. `/usage`를 모델 턴으로 단정했던 이전 설명을 정정한다. 이 결과는 해당 버전·계정의 두 실행에 한정한다.

### AGY 폴백 설정

- CLI 폴백은 기본 켜짐이다. 백엔드 프로세스 환경에서 `BISEO_AGY_CLI_ENABLED=0`일 때만 꺼지며, 미설정을 포함한 그 밖의 값은 켜짐이다. 기본 인수는 `-p /quota`이고 `BISEO_AGY_CLI_ARGS`로 바꿀 수 있다. 2026-11-07 agy 1.5.2에서 `/quota`와 `/usage`를 각각 1회 실행했을 때 두 명령 모두 print-mode 슬래시 명령으로 처리됐고 `generateContent`·`streamGenerateContent`는 0회였다. 이 실측은 해당 버전·계정·기본 인수에 한정하며, 사용자 지정 인수나 다른 버전의 모델 호출 여부를 보장하지 않는다.
- `BISEO_AGY_CLI_MIN_INTERVAL_MS`는 CLI 실행의 최소 간격이다. 기본값은 600000ms(10분)이며 더 작은 값은 10분으로 올린다. 간격 안에서는 마지막 CLI 결과를 재사용하고 CLI를 다시 실행하지 않는다. 같은 시점에 겹친 요청은 진행 중인 CLI 실행을 공유하므로 CLI는 한 번만 실행된다. 이 간격은 실행 빈도를 줄이는 안전장치이며 비용 상한은 아니다.
- `BISEO_AGY_CLI_CACHE_MS`(기본 300000ms)가 최소 실행 간격보다 길면 그 값까지 캐시를 유지한다. 실제 재실행 간격은 두 값 중 큰 값이다. CLI 실패 결과도 간격 동안 캐시되어 만료 전 재시도하지 않는다.
- 배포된 구버전 `runtime.json`에 `agyCliEnabled`가 남아 있어도 무시된다. `true`여도 폴백 설정을 바꾸지 않으며, 이 값을 바꾸는 것으로 활성화하거나 비활성화할 수 없다.
- 확인한 daily API 응답에는 Argon 주간 할당량이 없었다. API에 해당 값이 없고 CLI 폴백도 꺼져 있거나 실패하면 화면에 `unknown`(알 수 없음)과 재개 시각 미확인을 표시한다. `unknown`만으로 한도 소진이나 인증 만료를 확정할 수 없다. 다만 현재 `fetchAgyUsage`는 폴백 꺼짐·실패 경로에도 reason `agy_auth_expired`를 반환하며, 화면의 `isAuthRequired`는 이를 인증 필요로 분류한다. 실제 인증 만료 여부는 별도 확인해야 한다. 다른 모델의 값으로 추정하거나 주간 한도를 만들어내지 않는다. 폴백이 응답을 받아도 값이 없으면 알 수 없음으로 남는다.
- 배포 전 PM2 `biseo`의 실제 프로세스 환경에서 `BISEO_AGY_CLI_ENABLED=0`이 명시돼 있지 않은지 확인한다. 폴백을 끈 경우에만 값이 `0`인지 확인한다. 전체 환경변수나 자격증명은 출력하지 않는다. 이 확인을 위해 `runtime.json`을 수정하거나 서비스를 재시작하지 않는다.

## 자동 라벨 이름 보호

[#229](https://github.com/qus0in-factory/biseo/issues/229)은 pane 조회 중 자동 라벨러가 기존 agent·tab 이름을 덮어쓰던 경로를 보호한다. 자동 라벨러의 소유 기록이 없는 pane에 기존 agent name 또는 tab label이 있으면 pane·agent·tab rename을 모두 생략한다. 수동 pane label도 보호한다. 이름 없는 대상에는 모델 별칭 자동 라벨이 계속 적용된다.

rename 실패는 단계별 id·command와 `auto_label.rename_failed`로 기록한다. 세 rename은 원자적 트랜잭션이 아니므로 화면 이름만 보지 말고 실제 pane·agent·tab을 재조회한다. 이 보호는 다른 도구의 명시적 rename을 금지하거나 과거 이름을 자동 복구하는 기능이 아니다.

## 관측과 데이터

- 모델 관측: [pane-model-observe.ts](../../src/app/pane-model-observe.ts)는 OpenCode의 `recent-unwrapped`, AGY의 `visible` 상태줄을 읽는다. 캐시는 [pane-model-cache.ts](../../src/app/pane-model-cache.ts)에서 관리한다. 응답 수집·사용량 수집과는 별도다.
- 읽기 전용 effort 표시는 [#214 제안](https://github.com/qus0in-factory/biseo/issues/214)이며 미구현이다.
- API 정의: [Worker 라우트 등록](../../worker/ui/routes-registry.ts), [백엔드 라우트 등록](../../src/ui/app-routes.ts). 경로·메서드를 이름으로 추정하지 않는다.
- D1 스키마는 [마이그레이션](../../worker/migrations/)을 기준으로 한다. 작업 데이터의 소유자·workspace 범위와 인증·사용량·동기화 데이터의 범위는 서로 다르다.

## Wiki 작업

Wiki 저장소는 세션마다 새 경로에 clone한다. 이전 세션의 작업 디렉터리를 재사용하지 않는다. 편집 전 `git rev-parse --git-dir`로 Wiki 저장소인지 확인하고 코드 저장소의 `.git`이면 중단한다.

## 릴리스 노트

노트는 기억이 아니라 `git log --merges <이전 태그>..main` 병합 커밋 목록에서 유도한다. 줄마다 PR 번호를 적고 목록과 대조한다.

관련: [README](../../README.md) · [개발·승격](../development.md) · [Wiki](https://github.com/qus0in-factory/biseo/wiki).
