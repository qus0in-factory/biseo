# 0.4.1 예약 검증 (#84 #87 #80)

## Situation
- #138 구조의 D1이 예약 원본이며 lease와 requestId로 중복 전달을 차단한다.
- 취소·재접속·스케줄러 복구 구현은 이미 존재한다. 이번 변경은 취소 및 단건 조회 fallback의 소유자/workspace 격리 누락을 보완한다.

## Task
- 운영에는 접근하거나 새 prompt를 보내지 않는다. 아래 실운영 절차는 **미실행**이다.
- 테스트 SQLite D1 어댑터와 가짜 전송 포트는 실제 Herdr/PM2 재시작 검증을 대체하지 않는다.

## Action
- `cancel-scope*.test.ts`: 다른 소유자/workspace·없는 ID 취소의 upstream 접근 차단, DB 장애 fail-closed.
- `timeline-import-scope.test.ts`: 기존 비공개 턴을 upstream fallback으로 노출하지 않음.
- `live-queue-restart.test.ts`: 신규 예약 3개, 중간 취소, 완료 callback 누락 후 독립 스케줄러 실행, 결과 영속 조회·남은 FIFO·재실행 시 중복 없음.
- 기존 zero-shot composed 테스트: 서버/Worker 연결, 새 prompt 1회, SSE 결과, polling 없음. 실제 외부 pane은 사용하지 않는다.

### 승인 후 실운영 확인 절차
1. 운영자 승인과 전용 테스트 pane/비민감 prompt를 준비한다. requestId·workspace·pane·terminal generation을 기록한다. 토큰·쿠키·전체 terminal dump는 수집하지 않는다.
2. 첫 턴 처리 중 후속 3개를 예약하고 가운데만 취소한다. 취소 응답 200, D1 cancelled, 새로고침 후 동일 상태, 나머지 FIFO를 확인한다.
3. 전송 시작과 취소를 경합시킨다. 이미 working이면 409와 최신 상태/interrupt 안내를 확인한다. 실제 실행을 취소 성공으로 오표시하지 않아야 한다.
4. 별도 새 prompt를 보내 requestId 기준 접수→전송 1회→turn.finish→D1 완료 응답→SSE/UI 표시를 대조한다. 재로그인 후 동일 결과를 확인한다.
5. 전용 예약이 queued인 시점에 승인된 PM2 재시작을 수행한다. 새 프로세스가 D1 예약을 복구하고 동일 requestId를 중복 전송하지 않는지 확인한다. working 중 재시작은 불확실 전달을 실패로 표시할 수 있으며 무조건 재전송하면 안 된다.
6. callback 누락 시 스케줄러가 lease 유효 기간 내 완료를 회수하고 후속 예약을 실행하는지 확인한다. lease 만료 후 delivery_uncertain 정책도 별도로 확인한다. 운영 설정을 임의 변경해 이벤트를 차단하지 않는다.
7. 실패 시 requestId별 상태·시각·오류 코드만 보존하고 추가 전송을 중단한다. DB 롤백·재전송·재배포는 별도 승인 없이 하지 않는다.

## Result
- 로컬 자동 검증 결과는 작업 보고서와 `/tmp/i041/` 로그에 기록한다.
- 실운영 #80, 실제 PM2 재시작·재로그인 검증은 운영자 승인 후 남은 확인 범위다. UI/문구 변경은 없다.
