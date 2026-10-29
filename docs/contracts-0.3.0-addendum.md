# 0.3.0 추가 계약 (opus, 2026-10-29)
> 범위 갱신: 전송 예약(queued)·취소·cancelled는 0.3.1로 이월(docs/release/0.3.0-cut.md). 아래 해당 항목은 이월 초안이며 0.3.0 계약은 turn_timeout·재시도·종료 로그 항목.
- TurnStatus에 `cancelled` 추가. `queued` = 대상 패널이 바빠 대기 중(예약). 전환: queued→working|cancelled, working→completed|failed|timeout|capture_unavailable|blocked, timeout→completed(늦은 완료 허용).
- POST 턴 생성: 대상이 busy(working/blocked/잠김)이면 409 대신 202 + status queued로 패널별 FIFO 예약. 전송 불가 사유가 busy가 아닌 경우(미지원·없음 등)는 기존대로 409.
- 취소: web DELETE /api/turns/:requestId → Worker → backend DELETE /herdr/turns/:requestId. queued만 취소 가능(200, status cancelled), 그 외 409 not_cancellable. 같은 인증·Origin/CSRF 규칙.
- 예약 실행: 패널 잠금 해제 시 또는 herdr 패널 상태가 idle/done이 될 때 다음 queued 1건 전송. polling 금지(이벤트 기반). 예약은 메모리 저장(재시작 시 소실, 기존 한계와 동일).
- turn_timeout: herdr prompt는 --wait 없이 전송만, 완료 판정은 transcript 수집. 대기 상한 config `turnTimeoutMs`(기본 1800000). 상한 초과 시 timeout으로 표시하되 수집은 `lateCaptureMs`(기본 7200000)까지 계속해 완료되면 completed로 갱신.
- SSE: 모든 상태 변화는 기존 turn.updated로 전파.

## 0.3.1 계약 보완 (2026-10-29)

### 상태 전이 보완
- `queued → working | cancelled | failed`
  - `failed`: 대상 pane 소멸, 상태 미식별, capture 불가 등 예약 실행 불가 사유.
- `working → completed | failed | timeout | capture_unavailable | blocked`
- `working → failed/prompt_not_accepted`: #47 수락 게이트. `promptAcceptanceMs` 내 `working`/`blocked` 활동이 확인되지 않으면 `failed` + `prompt_not_accepted`.
- `timeout → completed` (늦은 완료 허용)은 유지한다.

### 오류 코드 (src/app 기준)
- `request_in_flight`: `createTurn`에서 requestId reserve 실패 (409 conflict).
- `not_cancellable`: `cancelTurn`에서 queued가 아니거나 queue remove 실패 (409).
- `not_found`: `cancelTurn` 대상 없음 (404).
- `prompt_not_accepted`: sendPrompt/runTurn 수락 게이트 실패.
- `agent_prompt_stalled`: herdr prompt 제출 직후 활동 미관측 신호.
- `agent_blocked`, `agent_not_ready`, `delivery_uncertain`, `herdr_error`, `herdr_unavailable`.
- `timeout`, `turn_timeout`, `capture_unavailable`, `response_capture_unavailable`.
- `target_not_found`, `target_not_ready`, `workspace_not_allowed` 등 대상/권한 사유.

### `agent_prompt_stalled`와의 관계
- `agent_prompt_stalled`는 제출 직후 활동 미관측 신호다.
- `promptAcceptanceMs` 게이트가 이를 `failed`/`prompt_not_accepted`로 변환한다.
- transcript confirm/read로 수락이 확인되면 `completed`로 복구할 수 있다.
- 자동 재전송은 하지 않으며, 사용자가 패널 상태를 확인한 뒤 수동으로 판단한다.
