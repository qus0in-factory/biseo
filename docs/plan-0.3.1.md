# 0.3.1 계획 (2026-10-29)

## 목표

0.3.0 릴리스 이후 사용자 요청 후속을 정리하고, 디자인·반응형 UX, 패널 고정, 이벤트 기반 전송 예약/취소, 제공자 가용성 분리, 응답 마크다운 렌더링을 0.3.1 마일스톤으로 묶는다. 기존 인증·CSRF/Origin·SSE·지정 workspace 제한·비밀 미노출·polling 금지 원칙을 유지한다.

## 범위

### 이슈별 요약

- #25 디자인 시스템과 반응형 채팅 UX (interface): shadcn/Tailwind 재사용, 모바일 탭/캐러셀, Safari/iOS 표현, 접근성, reduced-motion.
- #29 패널 고정/북마크 (interface): 패널 목록 최대 5개 높이 + 내부 스크롤, 북마크 최대 2개 상단 고정, 중복 제거, 선택 패널 scrollIntoView.
- #30 전송 예약 queued·취소 (service): busy 패널 POST → 202 queued, 패널별 FIFO, queued만 취소, 웹 예약/취소 UI, SSE `turn.updated`.
- #32 제공자 사용량 한도와 패널 가용성 (service): 실행 상태와 availability 축 분리, codex 구조화 출처, 미확인은 `unknown`.
- #38 응답 마크다운 렌더링과 원본 보기 전환 (interface): 렌더링/원본 토글, XSS 방지, 모바일 320px.
- #36 0.3.0 마감과 0.3.1 이월 정리 (tracking): 0.3.0 머지·배포 기록과 이월 항목 추적.

### 의존 순서

1. #40 queued→failed 전이·예약 취소 계약 보완: 계약 전이표에 queued→failed를 추가하고 예약 취소/실패 사유를 정의한다.
2. #30 백엔드 계약 안정화: 서버 상주 herdr 구독 반영 완료 상태의 dev 미커밋 변경을 재리뷰하고 계약 전이표를 보완한다.
3. #25 디자인 시스템 기반: 반응형 컨테이너, 토큰, 모바일 safe-area를 먼저 정리한다.
4. #29 패널 고정 UI: #25의 모바일 구조와 충돌하지 않게 구현한다.
5. #30 웹 예약/취소 UI: #25/#29 이후 채팅 화면에 통합한다.
6. #38 마크다운 렌더링: #25 디자인 규칙과 XSS sanitize 규칙을 따른다.
7. #32 가용성 정보: 독립적으로 진행하되 릴리스 전 availability 계약을 고정한다.

### 담당 영역

- web: #25, #29, #30 웹 UI, #38.
- server (`src/`): turn queue, SSE, pane lock, availability snapshot.
- worker (`worker/`): timeline routes, cancel route, herdr upstream/subscription.
- shared: turn status/contract type, auth/CSRF 규칙.

### 제외

- #24 D1 대화 내역 유지·과거 스크롤·검색은 0.3.2 마일스톤으로 제외한다.
- 자동 재전송(`delivery_uncertain`)은 0.3.1에서도 금지한다.

### 신규 이슈

- #39 채팅 UI 잔여 권고
- #40 queued→failed 전이·예약 취소 계약
- #41 Codex hook·rollout 성능
- #42 version 정책·릴리스 태그
- #43 테스트 시간 의존 잔여 정리(불안정 테스트 6파일 수정 자체는 0.3.0 마감에 포함)

## 수용 기준

- #29: 한 번에 최대 5개 표시, 내부 스크롤, 북마크 최대 2개 상단 고정, 중복 없음, 선택 패널 scrollIntoView.
- #30: busy → 202 queued, 패널별 FIFO, queued만 취소, polling 없음, SSE 전파, 계약 전이표 보완.
- #32: `available | limited | unknown`, limited만 차단, unknown은 차단하지 않음, raw dump/log/D1 저장 금지.
- #25: 모바일 탭/캐러셀, safe-area, 44px 터치, reduced-motion, 키보드/포커스/대비.
- #38: 렌더링/원본 토글, aria-pressed, XSS 방지, 코드 블록/표 처리, 모바일 320px.
- #36: 0.3.0 머지·배포·PM2 기록과 이월 항목 추적 유지.

## 위험

- #30 백엔드가 dev 작업트리에 미커밋으로 존재하므로 재리뷰·계약 전이표 보완이 필요하다.
- #32에서 claude/opencode/agy의 구조화 한도 출처가 미확인이며, 미확인을 available로 단정하면 안 된다.
- #25 디자인 시스템 변경 범위가 넓어 회귀 위험이 크다.
- 불안정 테스트 6파일과 Codex hook/rollout 검색 성능 이슈가 릴리스를 지연시킬 수 있다.
- Safari/iOS 표현은 실제 기기 또는 시뮬레이터 검증이 필요하다.
- 버전 정책과 릴리스 태그 결정이 배포 절차에 영향을 준다.
