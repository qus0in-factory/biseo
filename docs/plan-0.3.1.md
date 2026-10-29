# 0.3.1 계획 (2026-10-29, GitHub 대조 정리)

> 대조 기준: 2026-10-29 07:42 UTC 조회, origin/main `e2f4f55`(PR #55), origin/dev `e958f08`. 인계문만 믿지 않고 원격 이슈·PR·커밋과 대조했다. 본 문서가 최신이며 이슈와 모순되지 않는다.

## 목표

0.3.0 릴리스 이후 사용자 요청 후속을 정리하고, 디자인·반응형 UX, 패널 고정, 이벤트 기반 전송 예약/취소, 제공자 가용성 분리, 응답 마크다운 렌더링을 0.3.1 마일스톤으로 묶는다. 기존 인증·CSRF/Origin·SSE·지정 workspace 제한·비밀 미노출·polling 금지 원칙을 유지한다. 0.3.2(#24 #45 #46)와 신규 미분류(#60 #61)는 별도로 분리한다.

## 범위

### 이슈별 요약

- #25 디자인 시스템과 반응형 채팅 UX (interface): shadcn/Tailwind 재사용, 모바일 탭/캐러셀, Safari/iOS 표현, 접근성, reduced-motion.
- #29 패널 고정/북마크 (interface): 패널 목록 최대 5개 높이 + 내부 스크롤, 북마크 최대 2개 상단 고정, 중복 제거, 선택 패널 scrollIntoView.
- #30 전송 예약 queued·취소 (service): busy 패널 POST → 202 queued, 패널별 FIFO, queued만 취소, 웹 예약/취소 UI, SSE `turn.updated`.
- #32 제공자 사용량 한도와 패널 가용성 (service): 실행 상태와 availability 축 분리, codex 구조화 출처, 미확인은 `unknown`.
- #38 응답 마크다운 렌더링과 원본 보기 전환 (interface): 렌더링/원본 토글, XSS 방지, 모바일 320px.
- #36 0.3.0 마감과 0.3.1 이월 정리 (tracking): 0.3.0 머지·배포 기록과 이월 항목 추적.
- #47 수락 게이트 상태의 모달 오인 (service): promptAcceptanceMs 내 working/blocked·transcript 확인, 실패 시 `failed/prompt_not_accepted`, 자동 재전송 없음.
- #51 첫 대화 전 OpenCode 세션 수집 (service): 세션 없음도 전송 허용 후 새 세션 seq 0부터 수집. PR #66 OPEN(head `a817017`, base dev, `Closes #51`)로 이벤트 구독 전환·구독 직후 재확인·늦은 ack unsubscribe·종료 정리 보강. ds-o 최종 통과이나 실제 소켓 통합·최초 snapshot 종료/거절 테스트 잔여.
- #57 차단 사유 구분과 안전한 해제 (service): 한도 확정·승인대기·추정 구분, Esc allowlist(OpenCode Ctrl+C 금지), 한도 확정은 해제 불가.
- #63 패널 라벨/아이콘 컴포넌트 (interface): `web/panes.css`·`web/reason.css`·`web/theme.css`가 PR #56 변경 파일과 겹침; 소유권 경계 필요.
- #64 타임아웃 후 회수 보정 (service): `src/app/capture-turn*.ts`, `late-capture*.ts`, `web/domain/mergeTurn.ts`, `syncPending.ts` 수정 중, 미커밋 변경 있음.
- #65 AGENTS 보고 규칙 (process): 2분 규칙·콜백 중계 규칙 반영, 마일스톤·라벨 없음.
- #66 #51 구현 PR (OPEN, base dev, head `a817017`).
- #39 채팅 UI 잔여 권고 (interface), #42 version 정책·릴리스 태그 (process, 사용자 결정 대기).
- #25 1단계 PR #56 (미병합, 아래 상태 참조), 2단계(모바일 Tabs/Carousel/Sheet, Router·Zustand·Query·Zod) 잔여.
- #50 모바일 어긋남 핫픽스: 마일스톤 없음, worktree `fix/50-mobile` 보존, #25와 순서 미결정.
- 신규 미분류 #60 (FIFO·입력) #61 (예약중 무응답): 마일스톤·라벨 없음, 재현·범위·완료기준 필요. 0.3.1/0.3.2에 배정하지 않는다.
- 결정용 #62 Codex 전용 경로 유지·제거: 이 이슈에서 결정만, 실제 제거 금지.

### 의존 순서

1. #40 queued→failed 전이·예약 취소 계약 보완: 완료(CLOSED). PR #49 → dev `1fd3aee` → main `e2f4f55`.
2. #30 백엔드 계약 안정화: 코드 반영 완료(PR #49 → #55 main 승격). 남은 것은 배포 환경 예약 왕복 검증으로 #30에서 추적한다.
3. #25 디자인 시스템 기반: 반응형 컨테이너, 토큰, 모바일 safe-area를 먼저 정리한다.
4. #29 패널 고정 UI: #25의 모바일 구조와 충돌하지 않게 구현한다.
5. #30 웹 예약/취소 UI: main에 포함됨. 추가 UI 통합은 #25/#29 이후 필요 시 검토한다.
6. #38 마크다운 렌더링: #25 디자인 규칙과 XSS sanitize 규칙을 따른다.
7. #32 가용성 정보: 독립적으로 진행하되 릴리스 전 availability 계약을 고정한다.

### 담당 영역

- web: #25, #29, #30 웹 UI, #38.
- server (`src/`): turn queue, SSE, pane lock, availability snapshot.
- worker (`worker/`): timeline routes, cancel route, herdr upstream/subscription.
- shared: turn status/contract type, auth/CSRF 규칙.

### 제외

- #24 D1 대화 내역 유지·과거 스크롤·검색, #45 보안 점검, #46 `biseo.qus0in.dev` 연결은 0.3.2 마일스톤으로 제외한다(착수 없음).
- #60 #61 신규 수정요청은 미분류 백로그로 분리한다. 마일스톤을 임의 배정하지 않는다.
- 자동 재전송(`delivery_uncertain`)은 0.3.1에서도 금지한다.

### 신규 이슈

- #39 채팅 UI 잔여 권고
- #40 queued→failed 전이·예약 취소 계약 (CLOSED, main `e2f4f55` 포함 확인)
- #41 Codex hook·rollout 성능 (코드 main 포함, 새 SessionStart 운영 재확인 잔여 → 열어둠)
- #42 version 정책·릴리스 태그 (사용자 결정 대기)
- #43 테스트 시간 의존 잔여 정리 (CLOSED, main `e2f4f55` 포함 확인)
- #47 수락 게이트·모달 오인 (코드 main 포함, 실제 모달 재현 잔여 → 열어둠)
- #51 첫 세션 수집: PR #66 OPEN(head `a817017`, base dev). ds-o 최종 통과, 실제 소켓 통합·최초 snapshot 종료/거절 테스트 잔여.
- #57 차단 사유·해제 (PR #58 backend `710a7ee` + PR #59 web `02cccc9`, 미병합)
- #60 #61 신규 수정요청 (미분류, 스펙 필요)
- #62 Codex 전용 경로 유지·제거 결정 (결정만, 제거 금지)
- #63 패널 라벨/아이콘 (interface, 미커밋, PR #56 파일과 충돌)
- #64 타임아웃 회수 보정 (service, 미커밋)
- #65 AGENTS 보고 규칙 (process, 마일스톤·라벨 없음)
- #66 #51 구현 PR (OPEN, base dev)

## 상태 (2026-10-29 대조)

### 완료 (코드 main 포함, 이슈 종료)

- #40 계약 보완: PR #49(`d611be5`) → dev `1fd3aee` → main `e2f4f55`(PR #55). CLOSED 유지.
- #43 테스트 정리: PR #52 → dev `1fd3aee` → main `e2f4f55`. CLOSED 유지.

### 코드 main 포함, 수용 검증 잔여 (열어둠, 닫지 않음)

- #30 전송 예약·취소: PR #49 → #55 main 승격 확인. 웹 예약됨 배지·취소 버튼은 main(`e2f4f55`)에 포함. 남은 것은 배포 환경 예약 왕복 검증 → 열어둠.
- #32 가용성: PR #53 → #55 main 승격 확인. Codex 구조화 출처만 확정, ga 등 나머지 출처·최신성·수용 검증 잔여 → 열어둠.
- #41 Codex hook: PR #54 → #55 main 승격 확인. 새 SessionStart 실제 상태 파일 재확인 잔여 → 열어둠.
- #47 모달 오인: PR #49 수락 게이트 → #55 main 승격 확인. 실제 모달 1회 재현 미검증 → 열어둠.

### 잔여 (0.3.1)

- #25: 1단계 PR #56 `feat/25-design`(`cf505d3` → dev, 미병합, 227 pass, JS +31.7%). 2단계(모바일 Tabs/Carousel/Sheet, Router·Zustand·Query·Zod) 미착수.
- #29 패널 고정, #38 마크다운 토글, #39 잔여 권고: 미착수.
- #57: backend PR #58(`feat/57-unblock` head `e98c378`, 기준 `710a7ee`, 교차 23 tests) + web PR #59(`feat/57-web` head `4a400cc`, 기준 `02cccc9`, 254/254). 미병합·미배포, 실키 검증 없음. 권장 순서 #58 → #59.
- #51: PR #66 OPEN(head `a817017`, base dev). 이벤트 구독으로 폴링 교체·구독 직후 재확인·늦은 ack unsubscribe·종료 정리 보강. ds-o 최종 통과. 잔여: 실제 소켓 통합 미검증, 최초 snapshot 종료/거절 테스트(비차단).
- #63 패널 라벨/아이콘: 미커밋 변경, PR #56 파일 충돌(`web/panes.css`·`web/reason.css`·`web/theme.css`).
- #64 타임아웃 회수 보정: 미커밋 변경(`src/app/capture-turn*.ts`, `late-capture*.ts`, `web/domain/mergeTurn.ts`, `syncPending.ts`).
- #65 AGENTS 보고 규칙: 마일스톤·라벨 없음, 문서 규칙 보정.
- #66 #51 구현 PR: OPEN, base dev, head `a817017`, 미병합.

### 미정 (사용자 결정 대기, 임의 변경 없음)

- #50 vs #56 순서: #50 worktree `fix/50-mobile`(`9950729`, 구 dev 기준) 보존. #25 충돌 해소 전 병합 없음.
- #42 version 정책·릴리스 태그: `package.json` 0.3.0·footer 표시·태그 규칙 미결정.
- hermes 연동 제거: 미사용이나 제거 여부 미결정(#36/#62 사용자 결정 대기).
- #62 Codex 전용 경로: 유지·제거 결정용. 이 이슈에서 코드 제거 금지.

### 분리 (0.3.2·백로그)

- 0.3.2: #24 D1, #45 보안 점검, #46 `biseo.qus0in.dev`. 모두 미착수.
- 미분류 백로그: #60 (sol FIFO·입력), #61 (예약중 무응답). 마일스톤·라벨 없음 유지. 재현 조건·범위·완료 기준 확보 전 착수 없음.

## 완료 조건

- 최신 사실·PR 링크·main/dev 근거(`e2f4f55`/`e958f08`)·미결정이 위에 명시되고 이슈 본문과 모순이 없다.
- 마일스톤은 요청 목표만 유지하고 나머지는 백로그로 둔다.

## 수용 기준

- #29: 한 번에 최대 5개 표시, 내부 스크롤, 북마크 최대 2개 상단 고정, 중복 없음, 선택 패널 scrollIntoView.
- #30: busy → 202 queued, 패널별 FIFO, queued만 취소, polling 없음, SSE 전파, 계약 전이표 보완.
- #32: `available | limited | unknown`, limited만 차단, unknown은 차단하지 않음, raw dump/log/D1 저장 금지.
- #25: 모바일 탭/캐러셀, safe-area, 44px 터치, reduced-motion, 키보드/포커스/대비.
- #38: 렌더링/원본 토글, aria-pressed, XSS 방지, 코드 블록/표 처리, 모바일 320px.
- #36: 0.3.0 머지·배포·PM2 기록과 이월 항목 추적 유지.

## 위험

- #30 코드는 main `e2f4f55`에 승격됐고, 남은 위험은 배포 환경 예약 왕복 미검증이다.
- #32에서 claude/opencode/agy의 구조화 한도 출처가 미확인이며, 미확인을 available로 단정하면 안 된다.
- #25 디자인 시스템 변경 범위가 넓어 회귀 위험이 크다. PR #56 번들 +31.7%도 함께 검토한다.
- Codex hook/rollout은 main 포함 후 새 SessionStart 운영 재확인이 남았다(#41).
- Safari/iOS 표현은 실제 기기 또는 시뮬레이터 검증이 필요하다.
- 버전 정책과 릴리스 태그 결정이 배포 절차에 영향을 준다(#42 미결정).
