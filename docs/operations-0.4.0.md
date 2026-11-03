---
audience: user
---
# 0.4.0 운영과 복구

## 기준과 기능

2026-11-01 v0.4.0 릴리스 기준 운영 서버는 `biseo-release-041`의 0.4.0, 운영 Worker는 `4cab6e28-d15c-4261-a373-5cce18e4ec75`다. 직전 Worker는 `20e6603a-afa7-45ad-9687-cc25b6976232`, 직전 서버(복구 대상)는 `biseo-release-040`이다. 이는 릴리스 완료 시점의 기록이지 현재 상태의 실시간 보증이 아니다. 이전 운영 문서는 해당 버전의 기록이며 이 절차보다 우선하지 않는다.

- 인증된 대시보드에서 Herdr workspace 선택 및 패널 열기·닫기·이름 변경을 지원한다. 작업 중인 패널과 예약을 확인한다 (#113, #136).
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

### 0.5.2 (2026-11-03)

- **Situation / Task**: 사용자 승인 범위 dev `c39ecfc`의 #205 타임라인·#206 이름·#207 사용량/설정/전환과 0.5.x 문서를 0.5.2로 승격했다. 버전 단독 커밋 `ac26a92`, [PR #208](https://github.com/qus0in-factory/biseo/pull/208) main merge `fd6e6ad`, annotated `v0.5.2`와 latest 릴리스를 발행했다. 테스트 1028개 실패 0·typecheck·서버/클라이언트 build 통과, 필수 main-source와 보안 체크 성공 후 merge commit으로 병합했다.
- **Action**: 서버는 버전 커밋 기준 `biseo-release-052`로 전환했다. release-051 운영 config와 공개키를 바이트 비교 복사하고 preflight 통과, D1 미적용 마이그레이션 없음 확인 후 중계 queued/working 0건·최근 로그 활동 표식 0건에서 biseo만 PM2 delete/start했다. 16초 뒤 PID 15270, 0.5.2 online·재시작 0·오류 로그 0·로컬 미인증 health 401 및 다른 앱 불변을 확인하고 save했다.
- **Result**: 직전 Worker `0b9a0c17-0e89-4b6b-a3a2-844e235044ee`를 배포 직전 재확인한 뒤 `d2a6922d-f8f0-48fc-a492-8bf707bf3504`로 배포, 100% readback 확인. curl 공개 `/` 200, 미인증 `/api/health`·`session`·`usage`·`workspaces` 각 401, 모든 응답 CSP 확인. #205·#206·#207 CLOSED, 마일스톤 0.5.2 open=0 확인 후 종료했다.
- **복구 / 한계**: 서버 롤백은 보존한 release-051 `9575827`(0.5.1), Worker 롤백은 `0b9a0c17-0e89-4b6b-a3a2-844e235044ee`; 실제 롤백·D1 변경 없음. 첫 D1 조회는 일시적 Cloudflare 7403으로 실패했으나 읽기 재시도 성공(쓰기 0). Python HTTP 클라이언트의 루트 403은 curl에서 200/CSP로 확인했다. 인증된 health·실제 중계 전달·브라우저 e2e는 미실시. 이력 API/D1 유지 여부·잔여 UI·wiki 사실 표현 P2는 백로그다. 공유 runtime 미스테이징·해시 보존. 이 배포 기록은 dev에만 반영한다.

### v0.5.1 배포 — 2026-11-03

- **Situation / Task**: 사용자 지시로 로컬 dev `0320cd5` + 버전 커밋 `9575827`만 배포했다. 모바일 입력창 폭·모델명 잘림 수정은 포함하며, 타임라인 하단 고정 `a21dc14`와 워크스페이스 이름 표시 WIP `42b3a91`은 0.5.2로 이관하고 병합·수정하지 않았다. main 병합·태그·D1 쓰기는 하지 않았다.
- **Action**: release-051의 릴리즈 후보 코드 트리에서 테스트 1028개(28 suites, 실패/취소/skip/todo 0)·typecheck·서버/클라이언트 build 통과 후 package.json 버전만 `0.5.1`로 커밋하고 dev push/SHA 일치를 확인했다. 기존 client 500kB 초과 chunk 경고만 남았다. detached `biseo-release-051`을 `9575827`로 맞추고 release-050의 운영 config 전체·공개키를 비교·복사해 바이트 일치·키 0600 및 preflight 통과를 확인했다. 선택 설정 agyCliTimeoutMs는 기존 운영값을 보존하고 코드 기본값을 사용한다.
- **Action**: 미적용 D1 마이그레이션 없음, 전환 직전 queued/working 0건(쓰기 0), 최근 60초 서버 로그 28행의 중계 표식 0건·오류 로그 0바이트를 확인했다. 독립 Herdr pane 작업은 중단 조건에서 제외했다. biseo만 PM2 delete/start 후 27초 이상 경과 시 정확한 release-051 cwd/script·0.5.1·online·재시작 0·오류 로그 0바이트·해당 PID error-level out 로그 0·로컬 미인증 `/health` 401을 확인하고 save했다. 다른 앱 PID/상태/재시작 수는 동일했다.
- **Result**: 서버 `9575827` 0.5.1, Worker 직전 `42c9c156-2740-4ff2-b34a-7b4d15d3c984`를 재확인한 뒤 `0b9a0c17-0e89-4b6b-a3a2-844e235044ee`를 배포하고 100% readback했다. curl `/` 200, 미인증 health/session/usage/workspaces API 401, 응답 5개 모두 CSP 확인. 실제 롤백 없음. 서버 복구 대상은 `biseo-release-050` (`8196d41`, 0.5.0), Worker 복구 대상은 위 `42c9c156`이다.
- **PR / 한계**: 새 dev→main PR 생성은 기존 동일 head/base [PR #198](https://github.com/qus0in-factory/biseo/pull/198) 때문에 GitHub가 거부했다. #198의 제목·본문·마일스톤·상태는 변경하지 않았다(dev push는 자동 반영). 갱신된 0.5.1 PR 본문은 `/tmp/biseo-051-release-pr-body.md`에 보존하며 새 PR/0.5.1 마일스톤 지정은 미완료다. 공유 runtime 변경 SHA256 유지·미스테이징. 인증 health·메모리 턴 전체 조회·실제 운영 전달·브라우저/e2e 및 독립 배포 리뷰는 미실시(인증 미확보·배정 작업자 재분배 금지). PM2 데몬 버전 경고는 그대로 유지했다. 보고 `/tmp/herdr-report-sol-a-rel051.md`, 검증 증거는 OpenCode 임시 경로의 `rel051/`에 보존한다.

### v0.5.0 배포 — 2026-11-03

- **Situation / Task**: 사용자 승인 및 조율자의 활성 작업 범위 정정에 따라 dev `8196d41`을 배포했다. 중단 대상은 biseo 중계 턴이며 독립 Herdr 에이전트 작업은 제외했다. main 병합·태그·D1 쓰기는 하지 않았다.
- **Action**: 사전 릴리스 검증 974개 테스트 실패/취소/skip/todo 0·typecheck·build 통과를 재사용했다. detached `biseo-release-050`에 의존성을 설치하고 release-047c의 운영 config 전체·공개키(0600)를 새 스키마와 비교·복사하여 바이트 일치를 확인했다. 선택 설정 누락은 기본값을 사용하며 build·preflight 통과. 미적용 마이그레이션 없음, 전환 직전 D1 queued/working 0건·최근 60초 서버 로그 전달 흔적 0건·오류 로그 0바이트 확인 후 biseo만 PM2 delete/start했다.
- **Result**: 15초 뒤 release-050의 정확한 cwd 및 `dist/server/src/index.js`·0.5.0·online·재시작 0·오류 로그 0바이트·로컬 미인증 `/health` 401을 확인하고 save했다. 다른 PM2 앱의 PID·상태·재시작 수는 동일했다. Worker 직전 버전을 재확인한 뒤 `42c9c156-2740-4ff2-b34a-7b4d15d3c984`로 배포했다. curl `/` 200, 미인증 `/api/health`·`/api/session`·`/api/usage`·`/api/workspaces` 401 및 5개 응답 모두 CSP 확인.
- **롤백 / 한계**: 서버 복구 대상은 `biseo-release-047c`(`78c6e3d`, 0.4.7), Worker는 `a76ddd5c-9cd2-4210-bf53-67a3d9d1465b`이며 실제 롤백은 없었다. 공유 dev의 사용자 runtime 변경과 기존 release worktree 모두 보존했다. 인증 health·인증된 메모리 턴 전체 조회·실제 운영 전달·독립 타 계열 배포 리뷰는 미실시(인증 수단 미확보·배정 작업자 재분배 금지). 활성 작업 판단은 사용자 지정 D1 및 최근 로그 기준이다. PM2 데몬 버전 경고는 업데이트 없이 유지했다. 보고 `/tmp/herdr-report-sol-a-deploy050b.md`.

### v0.4.7 재배포 3단계 (release-047c) — 2026-11-02

- **Situation / Task**: 0.4.7 재배포의 문서 정리 단계다. 코드·배포·PM2·D1·PR 머지·태그는 수행하지 않으며 `config/runtime.json` 사용자 변경은 스테이징하지 않는다.
- **Action**: 메인 트리 `biseo` dev의 `docs/operations-0.4.0.md`에 현재 운영 기준을 사실대로 갱신한다. 서버는 `biseo-release-047c`(dev `78c6e3d`), Worker Version(s): (100%) `a76ddd5c-9cd2-4210-bf53-67a3d9d1465b`. 반영된 변경: #188 agy 모델 파서 수정. 위키 `biseo.wiki`의 Development-Log도 갱신·push한다.
- **Result / 한계**: 문서 커밋 후 dev push. 서버·Worker 값은 제공된 기준 기록이며 실시간 보증이 아니다. 인증 health·실제 운영 전달·타 계열 리뷰는 본 단계에서 미실시(재분배 금지).

### v0.4.7 재배포 3단계 — 2026-11-02

- **Situation / Task**: 0.4.7 재배포의 문서 정리 단계다. 코드·배포·PM2·D1·PR 머지·태그는 수행하지 않으며 `config/runtime.json` 사용자 변경은 스테이징하지 않는다.
- **Action**: 메인 트리 `biseo` dev의 `docs/operations-0.4.0.md`에 현재 운영 기준을 사실대로 갱신한다. 서버는 `biseo-release-047b`(dev `a884303`), Worker Version(s): (100%) `c59c681a-cac4-4156-89db-eb2181e66c76`. 반영된 변경: #185 조율자 보호 제거, #186 라벨 자동 인식, #187 드래그, 사용량 모달 수명 주기 수정. 위키 `biseo.wiki`의 Development-Log도 갱신·push한다.
- **Result / 한계**: 문서 커밋 후 dev push. 서버·Worker 값은 제공된 기준 기록이며 실시간 보증이 아니다. 인증 health·실제 운영 전달·타 계열 리뷰는 본 단계에서 미실시(재분배 금지).

### v0.4.7 배포 — 2026-11-02

- **Situation / Task**: 승인된 #183 초기 모델/사용량 연결 수정을 dev에 통합하고 0.4.7을 배포했다. main 병합·태그·재분배는 하지 않는다.
- **Action**: 코드 `076f7ed`, 테스트 907개 실패/취소/skip/todo 0·typecheck·build 통과 후 dev push. 사용자 runtime은 미스테이징. D1 미적용 마이그레이션·queued/working 없음, sol 외 에이전트 idle 및 직전 120초 턴/큐 POST 없음 확인. release-046b config 전체·공개키를 release-047로 복사하고 build·preflight 후 biseo만 PM2 delete/start했다.
- **Result**: release-047 서버 0.4.7, 15초 뒤 정확한 cwd/script·online·재시작 0·오류 로그 0바이트·미인증 health 401 확인 후 save. Worker `c2000bd3-306b-4720-830b-12ac334a5d58`, curl `/` 200·미인증 health/session/usage/workspaces/usage/history 401·모두 CSP 확인. 롤백은 서버 release-046b `b77b716`, Worker `c377cc60-9394-4826-96c3-2c5d787d7957`이다. Cloudflare 명령은 최대 3회 시도 정책이며 모두 첫 시도에 성공했다.
- **정리 / 한계**: 패널별 cwd·하단과 현재 세션의 메인 트리 이동을 확인한 뒤 미사용 release-046·biseo-181·biseo-usage-link 제거, biseo-pull은 이미 없음. release-046 변경 설정은 보호 백업 후 제거했다. 인증 health·메모리 턴 전체 조회·실제 운영 전달·타 계열 리뷰는 인증 미확보/재분배 금지로 미검증. 증빙 `/tmp/i047/`, 보고 `/tmp/herdr-report-sol-047.md`.

### v0.4.6 최종 릴리스 — 2026-11-02

- **Situation / Task**: 사용자 승인으로 RecentPull 상태 문구 간격을 정리하고 [PR #179](https://github.com/qus0in-factory/biseo/pull/179)의 CI 전체 통과 후 main `926621d`로 병합했다. `gh release create v0.4.6 --target main --generate-notes`로 [v0.4.6 릴리스](https://github.com/qus0in-factory/biseo/releases/tag/v0.4.6)를 발행했다.
- **Action**: web `3d4982c`에서 공통 `gap-4`와 상태 문구의 추가 margin 제거로 성공·중복·빈 응답·오류·로딩 모두 버튼과 16px 간격을 적용했다. 320·1024px 상태별 스크린샷과 DOM 실측 10건, 가로 넘침·페이지 오류 없음 확인. 테스트 902개 실패/취소/skip/todo 0, typecheck·build·preflight 통과 후 dev push. 수정 모듈 최대 20줄·921자.
- **Result**: 운영 서버 `b77b716` 대비 `src/` 변경 없음으로 PM2는 release-046b 그대로 유지했다. Worker `c377cc60-9394-4826-96c3-2c5d787d7957` 배포 후 curl `/` 200, 미인증 health/session/usage/workspaces/usage/history 401 및 응답 6개 CSP 확인. Worker 롤백 대상은 `0c61f56d-fb90-48ae-a8a6-2a5118fb3e23`. D1·서버 설정 변경 없음. 사용자 runtime 변경은 보존·미스테이징.
- **정리 / 한계**: biseo-pull은 이미 제거된 상태이며 biseo-181은 현재 sol 세션의 실제 경로이므로 보존했다. pane list와 모든 패널 하단을 다시 확인했다. 인증 API·실제 운영 전달 및 타 계열 독립 리뷰는 미실시(인증 미확보·재분배 금지). 스크린샷은 실제 Vite 앱과 mock API 기반이며 운영 인증 성공의 근거는 아니다. 증빙은 `/tmp/i046h/`와 `/tmp/herdr-report-sol-046h.md`에 둔다.

### v0.4.6 재배포 — 2026-11-02

- **Situation / Task**: 승인된 #180–#182 통합을 dev에 병합하고 버전 0.4.6을 유지해 재배포했다. PR #179 머지·태그·재분배 없음.
- **Action**: dev `b77b716`, 테스트 901개 실패 0·typecheck·build 통과 후 push. runtime 사용자 변경 미스테이징. 미적용 마이그레이션·queued/working 없음, 최근 서버 로그 300행의 턴/큐 POST 0건·sol 외 에이전트 idle 확인. release-046 config 전체·공개키를 release-046b로 복사하고 build·preflight 후 biseo만 PM2 delete/start했다.
- **Result**: 15초 뒤 release-046b cwd/script·0.4.6·online·재시작 0·오류 로그 0바이트·미인증 health 401 확인 후 save. Worker `0c61f56d-fb90-48ae-a8a6-2a5118fb3e23`, 공개 `/` 200·미인증 API 5개 401·모두 CSP 확인. 롤백은 서버 release-046과 Worker `a2ac3594-a679-474b-b1b9-36fba5c6be1c`다.
- **한계**: 서비스 서명키 부재로 인증 health·메모리 턴 전체 조회·운영 큐 실제 전달 미검증. 독립 배포 리뷰는 재분배 금지로 미실시. 최초 D1 테이블명·PM2 JSON 전처리·zsh 예약 변수 오류는 수정 후 검증 완료.
- **정리**: pane list·각 패널 하단 경로 확인 후 release-045(변경 설정 보호 백업)·biseo-180·182·046b·pull 제거. 현재 sol 세션 biseo-181과 운영 release-046b·롤백 release-046 보존.

### v0.4.6 — 2026-11-02

- **Situation / Task**: 사용자 승인으로 `integrate/0.4.6`을 dev에 병합하고 0.4.6을 배포했다. main 병합·태그·재분배는 금지했다.
- **Action**: `integrate/0.4.6` `22fd435`를 dev `dae80c8`에 병합하고 `2d61dae`로 버전을 0.4.6으로 올렸다. 테스트 888개 실패 0·typecheck·build 통과 후 dev에 push했다. D1 미적용 마이그레이션은 없었고 queued/working 턴은 0건이었다. Cloudflare 7403은 2번째 시도에 성공했다.
- **Action**: `release-045` config 전체와 `service-public.key`를 `release-046`에 복사하고 build·preflight를 통과했다. biseo만 PM2 delete/start했고, 15초 뒤 정확한 cwd/script·버전 0.4.6·online·재시작 0·오류 로그 0바이트·로컬 `/health` 401을 확인한 뒤 save했다. `config/runtime.json` 사용자 변경은 스테이징하지 않았다.
- **Result**: Worker `a2ac3594-a679-474b-b1b9-36fba5c6be1c`, 공개 루트 200 및 미인증 health/session/usage/workspaces/usage/history/grok 401, 6개 응답 CSP 확인. 서버 복구 대상은 release-045 `1b39e9b`, Worker 복구 대상은 `51ebfc88-33ff-4902-a82a-0571190387b7`이다. main 승격은 [PR #179](https://github.com/qus0in-factory/biseo/pull/179)로 요청했고 병합·태그는 하지 않았다.
- **Result**: release-043과 병합 완료 작업 worktree 5개(biseo-pull, biseo-pane-card, biseo-header, biseo-auth-stale, biseo-046)를 제거하고 release-045는 롤백용으로 보존했다. release-043 config는 보호 경로에 백업한 뒤 제거했다.
- **한계**: 인증 health·메모리 턴 전체 조회·운영 큐 전달은 인증 수단 미확보로 미검증이며, 타 계열 리뷰는 재분배 금지로 미실시했다. PM2 버전 경고는 데몬 갱신 없이 유지했다.

### v0.4.5 — 2026-11-02

- **Situation / Task**: 사용자 승인으로 #169·#170 통합 dev에 cron fake-timer 동기화 수정 `2c74646`을 병합하고 0.4.5를 배포했다. main 병합·태그·재분배는 금지했다.
- **Action**: 코드 `1b39e9b`, 테스트 869개 실패 0·typecheck·build 통과 후 dev push. D1 미적용 마이그레이션 없음, queued/working 0건. Cloudflare 7403은 2번째 시도 성공. 잘못된 테이블명 조회는 읽기 전용 실패 후 `timeline_turns`로 정정했다.
- **Action**: release-043 config 전체·공개키를 release-045로 복사하고 build·preflight 통과. sol 외 작업 중 에이전트 없음·최근 턴 POST 없음 확인 후 biseo만 PM2 delete/start. 15초 뒤 정확한 cwd/script·버전 0.4.5·online·재시작 0·오류 로그 0바이트·로컬 health 401 확인 후 save했다.
- **Result**: Worker `51ebfc88-33ff-4902-a82a-0571190387b7`, 루트 200 및 미인증 health/session/usage/workspaces/usage/history 401, 6개 응답 CSP 확인. 서버 복구 대상 release-043, Worker 복구 대상 `c8ee6550-ec5b-4036-9886-1991bcaa4e4d`. 백업·검증 증거는 보호된 `.backups/0.4.5/`에 보존하며 runtime 사용자 변경은 복원·스테이징 제외했다.
- **한계**: 인증 health·메모리 턴 전체 조회·운영 큐 전달은 인증 수단 미확보로 미검증이며, 타 계열 리뷰는 재분배 금지로 미실시. PM2 버전 경고는 데몬 갱신 없이 유지했다. PM2 JSON 앞 경고 문자열을 분리해 검증했으며 원본은 보호 경로에만 보관한다.

### v0.4.4 — 2026-11-02

- **Situation / Task**: #162·#164·#165를 dev `688c7ef`에 통합하고 7403 차단에서 재개했다. 일시 Cloudflare API 오류는 최대 3회 재시도한다. 이번 재조회는 첫 시도에 성공했다.
- **Action**: 기존 862 테스트 실패 0·typecheck·build·375/1024의 8개 화면 검증을 재사용했다. 권한 600의 비어 있지 않은 D1 백업 후 유일한 미적용 `0012_usage_history.sql`을 적용하고 테이블 6열·복합 기본키·observed 인덱스·적용 이력을 확인했다.
- **Action**: release-043 대비 src 차이는 테스트 전용이므로 서버 전환을 생략했다. 서버는 release-043 `547127f`의 0.4.3 online·재시작 0 확인. runtime 로컬 변경은 보호 백업 후 배포 중 HEAD 값으로 복원해 깨끗한 커밋 트리에서 배포하고 원본과 일치하게 되돌렸다.
- **Result**: Worker `d470a93a-af14-4180-a213-a4d641c1587a`, curl 루트 200·미인증 health/session/usage/workspaces/usage/history 401·6개 CSP 확인. Worker 롤백은 `a715bcdf-85cf-40ff-9d58-5047008c86dd`. 화면 0.4.4와 서버 0.4.3 차이는 의도된 서버 유지 결과다.
- 병합된 깨끗한 작업 worktree 6개(043-app, 043-platform, 161, 162, 164, 165)를 제거했다. release-044 전환이 없으므로 release-042·043 보존. 인증 API·운영 큐·타 계열 리뷰 미실시(인증 미확보/재분배 금지). 관측 누적 전 비율 자료 부족은 정상이다. PM2 변경·main 병합·태그 없음.

### v0.4.4 릴리스 완료 — 2026-11-02

- **Situation / Task**: `fix/loading-state`, `fix/usage-align`, `fix/171-compact-align`을 dev에 병합하고 0.4.4 최종 릴리스를 진행했다. PR #166 CI 통과 후 main 승격과 태그 발행이 필요했다.
- **Action**: 테스트 866개 실패 0·typecheck·build 통과. `web/resources.json` 양쪽 키를 보존한 병합 충돌 없음. release-043 `547127f` 대비 `src/` 변경은 테스트 전용(`first-session-db-fixture.ts` 등)이므로 서버 전환을 생략했다. preflight 통과 후 Worker `c8ee6550-ec5b-4036-9886-1991bcaa4e4d`를 배포했다. curl 루트 200, 미인증 `/api/health`·`/api/session`·`/api/usage`·`/api/workspaces`·`/api/usage/history` 401, 모든 응답 CSP 확인. PR #166을 main에 병합하고 `v0.4.4` 릴리스를 발행했다.
- **Result**: main `ded12e0`, 릴리스 https://github.com/qus0in-factory/biseo/releases/tag/v0.4.4. Worker 롤백 대상은 `d470a93a-af14-4180-a213-a4d641c1587a`, 서버 롤백 대상은 release-043 `547127f`. runtime 로컬 변경은 `tmp/runtime.json.beam-backup`에 보존하고 스테이징하지 않았다. PM2·D1 변경 없음.
- **한계**: 인증 API·운영 큐·타 계열 리뷰는 미실시(인증 미확보/재분배 금지). 관측 누적 전 비율 자료 부족은 정상이다.

### v0.4.3 — 2026-11-02

- **Situation / Task**: 승인된 #45 보안 변경과 #161 타임라인 이름·로그인 변경을 dev에 통합하고 서버·Worker를 함께 전환했다. main 병합·태그·재분배는 금지했다.
- **Action**: 코드 `547127f`, 테스트 839개 실패 0·typecheck·build 통과. 375/1024에서 34개 화면·상태와 헤더 새로고침 버튼 표시를 확인했다. D1 미적용 마이그레이션 없음(백업·적용 없음), queued/working 0건, sol 외 작업 중 에이전트 없음, 최근 서버 로그 턴 POST 없음을 확인했다.
- **Action**: release-042 config 전체와 공개키를 release-043으로 복사하고 build·preflight 통과 후 biseo만 PM2 delete/start했다. 복사본은 기존 운영값을 보존하며 새 선택 설정은 코드 기본값을 사용한다. dev의 runtime 로컬 변경은 스테이징하지 않았다.
- **Result**: release-043의 서버 0.4.3, 15초 후 online·정확한 cwd/script·재시작 0·오류 로그 0바이트·로컬 health 401 확인 및 PM2 save. Worker `a715bcdf-85cf-40ff-9d58-5047008c86dd` 배포 후 curl `/` 200, 미인증 health/session/usage/workspaces 401, 5개 응답 모두 CSP 존재 확인. 서버 롤백은 release-042, Worker 롤백은 `886aa75f-48bc-4e29-acb2-9a2fa6d342a3`다.
- release-041은 로컬 config를 제한된 임시 디렉터리에 보존한 뒤 제거했다. 인증 health·메모리 턴 전체 조회·실제 운영 큐 전달·타 계열 리뷰는 미실시(인증 수단 미확보/재분배 금지). 첫 안정성 검증 스크립트의 모듈 형식 오류에도 셸이 save/배포를 계속한 절차 결함이 있었고, 즉시 수정한 검증과 공개 응답 검증이 통과한 뒤 save를 다시 실행했다. 제품 실패는 관측하지 않았다.

### v0.4.2 — 2026-11-01

- **Situation / Task**: #158·#159 변경을 포함한 dev `0900b57`의 package 버전을 0.4.2로 올리고 Worker 화면 버전을 맞췄다.
- **Action**: 테스트 817개 실패 0·typecheck·build·preflight 통과 후 깨끗한 커밋 트리에서 Worker `886aa75f-48bc-4e29-acb2-9a2fa6d342a3`를 배포했다. 직전·롤백 Worker는 `784cd9eb-72ea-4dad-bd33-c2a7bb96e69b`다.
- **Result**: curl `/` 200, 미인증 `/api/health`·`/api/session`·`/api/usage`·`/api/workspaces` 401. 클라이언트 번들 버전 0.4.2 확인. **서버는 release-042 `fd1132c`의 0.4.1 그대로이므로 화면 0.4.2와 표시 버전이 다르다.** PM2·D1 변경 없음. runtime 로컬 변경은 백업·복원했고 커밋에서 제외했다. 인증 API·브라우저 검증과 타 계열 리뷰는 수행하지 않았다(재분배 금지).
- main 승격과 태그 릴리스는 dev→main PR의 CI 통과 후 진행한다.

- #159 (2026-11-01): dev `f7817a2`에서 Worker `784cd9eb-72ea-4dad-bd33-c2a7bb96e69b` 배포(직전·롤백 `b000733c-b77e-4ef8-8f57-1cfcb4da1c6b`); release-042 `fd1132c` 대비 `src/` 변경 없음, 테스트 817개 실패 0·typecheck·build·preflight 통과, curl `/` 200 및 미인증 `/api/health`·`/api/session`·`/api/usage`·`/api/workspaces` 401 확인; PM2·D1·태그·PR·Python·재분배 없음.

- #158 (2026-11-01): 승인된 사용량·패널 표시 수정을 dev `5802387`에서 Worker `b000733c-b77e-4ef8-8f57-1cfcb4da1c6b`로 배포했다(직전·롤백 대상 `69a51c4e-53af-47d3-b9b8-480ff3e31004`). release-042 `fd1132c` 대비 `src/` 변경 없음, 테스트 813개 실패 0·typecheck·build·preflight 통과, curl `/` 200 및 미인증 `/api/health`·`/api/session`·`/api/usage`·`/api/workspaces` 401 확인; PM2·D1·태그·Python·worktree 삭제·재분배 없음.
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

서버 기본값은 `config/runtime.json`, 패널 템플릿은 `config/pane-templates.json`, 화면 임계값은 `web/resources.json`을 확인한다. 서버의 workspace, callback, 서비스 토큰 issuer/audience 및 공개키 경로는 실제 환경에 맞춘다. Worker의 세션·PIN·refresh TTL, 허용 호스트·origin, cron 및 D1 바인딩은 `wrangler.jsonc`를 확인한다. 비밀번호·서명 개인키 등 비밀은 보호된 secret 경로에서 관리하고 문서나 로그에 남기지 않는다. 설정 파일의 기본값을 운영값으로 가정하지 않는다.

운영 마이그레이션 전 인증과 복구 방식을 확인하고, 권한을 제한한 비어 있지 않은 D1 백업을 확보한다. 적용 이력을 조회해 누락분만 순서대로 적용한다. 0.4.0 릴리스 보고에서는 0007–0011 적용 및 스키마 확인을 마쳤다.

| 번호 | 변경 |
|---|---|
| 0007 | 큐 대상 terminal 세대, lease와 FIFO 인덱스 |
| 0008 | 큐 재시도 횟수 |
| 0009 | 신뢰 IP, PIN 및 시도 제한 |
| 0010 | 사용량 기간 시작 시각 |
| 0011 | refresh 세션과 토큰 계열 |
| 0012 | 사용량 관측 이력과 observed 인덱스 |

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
