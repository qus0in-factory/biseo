---
audience: user
---
# 0.4.0 운영과 복구

## 기준과 기능

2026-11-01 v0.4.0 릴리스 기준 운영 서버는 `biseo-release-041`의 0.4.0, 운영 Worker는 `4cab6e28-d15c-4261-a373-5cce18e4ec75`다. 직전 Worker는 `20e6603a-afa7-45ad-9687-cc25b6976232`, 직전 서버(복구 대상)는 `biseo-release-040`이다. 이는 릴리스 완료 시점의 기록이지 현재 상태의 실시간 보증이 아니다. 이전 운영 문서는 해당 버전의 기록이며 이 절차보다 우선하지 않는다.

- 인증된 대시보드에서 Herdr workspace 선택 및 패널 열기·닫기·이름 변경을 지원한다. 작업 중인 패널, 예약과 조율자 보호를 확인한다 (#113, #136).
- D1 예약은 패널별 FIFO·lease·재시도로 복구한다. 전달 결과가 불확실한 경우 중복 가능성을 확인하며 정확히 한 번 전달을 보장한다고 단정하지 않는다 (#138).
- 신뢰 IP와 6자리 PIN, 세션 refresh 회전·재사용 탐지를 지원한다. PIN은 IP 단독 인증이 아니며 신뢰 IP 철회 후 PIN 갱신을 차단한다 (#118, #143).
- 패널 상태 집계, 사용량 경고(5h 90%, 주·월 98%, 미확인은 별도), 접힌 패널 수 1~3 조절, Argon 주간 사용량을 제공한다. 상단 알림과 OpenCode Free 사용량은 제거했다 (#137, #139–#142, #144).
- #148에서 Herdr 화면(`pane read`) 관측으로 OpenCode·agy 패널의 실제 모델을 식별하고 5초 TTL 캐시와 함께 PaneSummary에 병합하여, 패널별 실제 모델 기준 사용량 경고를 연결했다 (#148). 모델 표시 줄 외 터미널 내용은 저장·전송하지 않는다.
- 설정 모달에서 신뢰 IP·워크스페이스 선택·패널 관리를 제공하고, #147에서 설정 작업과 이름 수정·닫기 버튼을 아이콘 중심으로 정렬했다 (#147). #149에서 설정 모달을 탭(보안, 워크스페이스, 패널)으로 구성하고 패널 추가는 별도 모달로 분리했다 (#149).
- 사용량 목록에서 한도에 도달한 행은 빨간색으로 강조 표시한다 (#150).
- 로그인 화면에서 비밀번호·간편 PIN 전환 버튼(선택 시 배경색 표시, aria-pressed) 및 직전 선택 모드 localStorage 저장·복원, 브라우저 자동완성 경고 방지를 지원하며, 헤더 제목은 데스크톱·모바일 모두 Biseo로 표기한다 (#151).
- 접기 토글은 드로어와 함께 동작하며 접힌 패널 수는 1~3 범위에서 조절한다 (#144, #147).
- 패널 템플릿은 `opencode`와 `agy`만 제공한다. `config/pane-templates.json`은 dev 저장소 값과 동기화하고 `cmp`로 일치를 확인했다 (#147).

## 핫픽스 및 배포 이력

- #156 (2026-11-01): 패널 펼침 목록 높이 수정을 dev `9b93a58`에서 Worker `ab2293f5-f118-4b9e-bbbd-7f10647796b1`로 배포했다(직전 `ccdfb53a-b38b-42b2-8f53-2a73286451d1`). release-042 `fd1132c` 대비 `src/` 변경 없음, 테스트 788개·typecheck·build·preflight 통과, curl `/` 200 및 미인증 `/api/health`·`/api/session`·`/api/usage`·`/api/workspaces` 401 확인; PM2·D1 변경 없음.
- #146: Worker `35d31395-4cf6-4717-8ab0-91b7aacc88f9`. 사용량 미확인 아이콘을 제거하고 인증·워크스페이스 설정 레이아웃을 정정했다. `src/` 서버 변경은 없었다.
- #147: Worker `65a50df5-92cb-498e-9509-eb2fa68ae893`. 드로어 제어와 설정 작업을 정렬하고 접힌 패널 수 조절 UI와 `config/pane-templates.json`(opencode, agy) 동기화를 반영했다. `src/` 서버 변경은 없었다.
- #149–#151: Worker `20e6603a`. 설정 탭과 패널 추가 모달 분리(#149), 사용량 한도 행 빨간색 강조(#150), 로그인 전환 버튼·선택 기억 및 헤더 제목 Biseo 축소, 모바일 가로 넘침 방지(#151)를 배포했다. `src/` 서버 변경은 없었다.
- #148 (v0.4.0 릴리스 배포): Worker `4cab6e28-d15c-4261-a373-5cce18e4ec75`, 서버 `biseo-release-041` (commit `ee0ce0e`). 패널 실제 모델 식별 및 사용량 경고 연결을 위해 PM2 delete/start로 서버를 전환하고 Worker를 배포했다. 배포 후 Python `urllib` 기본 클라이언트 요청 시 Cloudflare WAF/User-Agent 정책으로 HTTP 403이 반환되는 현상이 확인되었으나, curl 및 브라우저에서 루트 200, 미인증 401 정상 동작을 확인하여 v0.4.0 배포 완료를 판정했다. 이후 병합된 worktree 21개 정리를 완료했다.

## 알려진 한계와 참고 사항

- **Python urllib 403 참고**: Python 기본 `urllib.request`는 기본 User-Agent로 인해 Cloudflare 에지단에서 HTTP 403 Forbidden을 반환할 수 있다. 헬스체크 및 공개 엔드포인트 검증 시 브라우저 헤더를 사용하거나 curl을 권장한다.
- **모델 식별 범위**: 관측 파서는 OpenCode `Build` 상태줄과 agy 하단 상태줄만 지원하며, OpenCode `OpenCode`(free)나 `Google` 표기는 사용량 풀 근거 불충분으로 경고에 연결하지 않는다 (모델 미확인 시 경고 없음).
- OpenCode Go 제공자의 잔액 조회는 미지원이다 (`unsupported`).

## 0.4.1 범위

### 0.4.1 릴리스 — 2026-11-01

- **최종 통합 (Situation / Task)**: 승인에 따라 #157 UI 수정과 usage timeout 테스트 동기화 수정(`7abd79b`)을 dev `9c32727`에 통합했다.
- **Action / Result**: 테스트 796개 실패 0·typecheck·build·preflight 통과, release-042 `fd1132c` 대비 `src/` 변경 없음 확인 후 Worker만 `69a51c4e-53af-47d3-b9b8-480ff3e31004`로 배포했다. curl `/` 200, 미인증 `/api/health`·`/api/session`·`/api/usage`·`/api/workspaces` 401. 직전 Worker(롤백 대상)는 `ab2293f5-f118-4b9e-bbbd-7f10647796b1`; 서버 release-042 유지. PM2·D1·Python·worktree 삭제·재분배 없음. PR #155 CI 확인 후 main 병합 및 v0.4.1 릴리스 발행은 후속 게이트다.

- **Situation / Task**: 큐·사용량/PIN·비동기 목록 UI 변경을 통합해 dev에서 배포했다. main 승격은 [PR #155](https://github.com/qus0in-factory/biseo/pull/155)로 요청했으며 병합·태그는 하지 않았다.
- **Action**: 서버 `biseo-release-042`, 코드 `fd1132c`, 버전 0.4.1. 기존 release-041의 운영 설정과 `service-public.key`를 복사하고 build·preflight 후 biseo만 PM2 delete/start했다. Worker는 `ccdfb53a-b38b-42b2-8f53-2a73286451d1`로 배포했다.
- **Result**: 통합 테스트 787개·typecheck·build, 375·1024 화면/상태 34개 검증 통과. 서버 15초 뒤 cwd/script/version/online, 재시작 0, 오류 로그 0바이트, 로컬 `/health` 401 확인 후 save했다. curl로 `/` 200, `/api/health`, `/api/session`, `/api/usage`, `/api/workspaces` 401 확인.
- D1 미적용 마이그레이션 없음: 백업·스키마 변경은 실행하지 않았다. 전환 전 D1 queued/working 0건, Herdr에서 sol 외 작업 중 에이전트 없음과 최근 서버 로그에 턴 POST 없음 확인. 이는 인증된 메모리 턴 전체 조회나 인증 health 성공을 대신하는 증거는 아니다. 해당 인증 검증은 수행하지 않았다.
- 복구 대상: 서버 `biseo-release-041`, Worker `4cab6e28-d15c-4261-a373-5cce18e4ec75`. release-040·release-041·dev-040 및 보류 worktree는 보존했다.
- 사용량 전용 upstream timeout 30초·retry 0과 agy CLI timeout 설정을 반영했다. 빈 목록/오류/로딩 상태를 분리하고 선택 강조는 배경색·ARIA로 유지했다. 렌더링 검증의 오래된 선택자를 `li[aria-current="true"]`로 고친 뒤 재검증했으며 제품 오류로 판정하지 않았다.

0.4.1 계획 당시의 백로그(아래 항목 전체의 완료를 뜻하지 않는다):
- 큐 안정성 및 스톨 방지: D1 큐 working/queued 상태 동기화 및 스톨 조사 (#103, #115, fix/041-queue).
- 사용량 및 PIN 개선: 사용량 풀 추가 연동 및 PIN 편의성 보강 (feat/041-usage-pin).
- 아바타 및 UI 정밀화: 패널 아바타 표시 (#95) 및 툴팁 자동 닫기 잔여 건.
- 미확인 모델 풀 매핑 근거 수립 (OpenCode free 등).

## 설정과 D1

서버 기본값은 `config/runtime.json`, 패널 템플릿과 조율자 보호는 `config/pane-templates.json`, `config/coordinator-panels.json`, 화면 임계값은 `web/resources.json`을 확인한다. 서버의 workspace, callback, 서비스 토큰 issuer/audience 및 공개키 경로는 실제 환경에 맞춘다. Worker의 세션·PIN·refresh TTL, 허용 호스트·origin, cron 및 D1 바인딩은 `wrangler.jsonc`를 확인한다. 비밀번호·서명 개인키 등 비밀은 보호된 secret 경로에서 관리하고 문서나 로그에 남기지 않는다. 설정 파일의 기본값을 운영값으로 가정하지 않는다.

운영 마이그레이션 전 인증과 복구 방식을 확인하고, 권한을 제한한 비어 있지 않은 D1 백업을 확보한다. 적용 이력을 조회해 누락분만 순서대로 적용한다. 0.4.0 릴리스 보고에서는 0007–0011 적용 및 스키마 확인을 마쳤다.

| 번호 | 변경 |
|---|---|
| 0007 | 큐 대상 terminal 세대, lease와 FIFO 인덱스 |
| 0008 | 큐 재시도 횟수 |
| 0009 | 신뢰 IP, PIN 및 시도 제한 |
| 0010 | 사용량 기간 시작 시각 |
| 0011 | refresh 세션과 토큰 계열 |

## 서버 worktree 전환

1. 현재 PM2 `biseo`의 cwd·script·버전·재시작 횟수와 다른 앱을 확인하고 기존 worktree를 보존한다. D1의 queued/working 턴과 실제 활성 작업을 확인한다. D1 조회만으로 메모리 내 작업이 없다고 단정하지 않는다.
2. 새 worktree에 의존성 설치 및 빌드를 마치고 기존 운영 설정을 새 스키마와 비교해 안전하게 반영한다. **기존 worktree의 `config/service-public.key`를 새 worktree의 같은 경로로 복사**하고 경로·권한을 확인한다. 필요한 다른 운영 파일도 누락 여부를 점검하되 비밀을 출력하지 않는다. `pnpm preflight`를 실행하고 인증된 health 확인 수단을 전환 전에 확보한다.
3. `startOrRestart`로 worktree를 전환하지 않는다. 성공 메시지에도 기존 cwd/script가 남은 사례가 있다. 승인과 중단 계획을 확인한 뒤 `biseo`만 `pnpm exec pm2 delete biseo`로 삭제하고, 새 worktree에서 `pnpm exec pm2 start ecosystem.config.cjs --only biseo`로 시작한다. 다른 PM2 앱은 건드리지 않는다.
4. 최소 15초 뒤 online, 새 cwd와 `dist/server/src/index.js`, 예상 버전, 재시작 횟수 증가 없음과 오류 로그를 확인한다. 인증 health와 미인증 거부도 확인한다. 실패 시 즉시 아래 서버 복구를 실시한다. 모든 게이트 통과 후에만 `pnpm exec pm2 save`한다.
5. Worker 배포 전에 실제 현재 버전 ID를 기록한다. 배포 후 공개 루트와 미인증 API 응답을 확인한다. 릴리스 당시 루트 200, `/api/health` 401이 보고되었다.

## 롤백

- 서버: 활성 작업과 PM2 상태를 확인하고 `biseo`만 삭제한 뒤 보존된 직전 worktree의 ecosystem 파일로 시작한다. cwd·script·버전·15초 안정성·health 및 로그를 재확인하고 성공 시 저장한다. 릴리스 중 실제로 0.3.13으로 복구한 기록이 있다.
- Worker: 배포 직전에 기록한 이전 버전과 현재 CLI 사용법을 확인한 뒤 `pnpm exec wrangler rollback <이전-버전-ID>`를 사용하고 공개 응답을 검증한다. 위 ID는 0.4.0 당시의 기록일 뿐 이후 배포의 직전 버전이 아니다.
- D1: 애플리케이션 구버전과 현 스키마 호환성, 백업 이후의 쓰기와 데이터 손실을 먼저 평가한다. 백업을 무조건 덮어쓰지 않는다. 필요하면 쓰기 중지·복구 시점·복구 검증을 별도로 결정한다.
