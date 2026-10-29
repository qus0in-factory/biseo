# 0.3.0 추가 계약 (opus, 2026-10-29)
> 범위 갱신: 전송 예약(queued)·취소·cancelled는 0.3.1로 이월(docs/release/0.3.0-cut.md). 아래 해당 항목은 이월 초안이며 0.3.0 계약은 turn_timeout·재시도·종료 로그 항목.
- TurnStatus에 `cancelled` 추가. `queued` = 대상 패널이 바빠 대기 중(예약). 전환: queued→working|cancelled, working→completed|failed|timeout|capture_unavailable|blocked, timeout→completed(늦은 완료 허용).
- POST 턴 생성: 대상이 busy(working/blocked/잠김)이면 409 대신 202 + status queued로 패널별 FIFO 예약. 전송 불가 사유가 busy가 아닌 경우(미지원·없음 등)는 기존대로 409.
- 취소: web DELETE /api/turns/:requestId → Worker → backend DELETE /herdr/turns/:requestId. queued만 취소 가능(200, status cancelled), 그 외 409 not_cancellable. 같은 인증·Origin/CSRF 규칙.
- 예약 실행: 패널 잠금 해제 시 또는 herdr 패널 상태가 idle/done이 될 때 다음 queued 1건 전송. polling 금지(이벤트 기반). 예약은 메모리 저장(재시작 시 소실, 기존 한계와 동일).
- turn_timeout: herdr prompt는 --wait 없이 전송만, 완료 판정은 transcript 수집. 대기 상한 config `turnTimeoutMs`(기본 1800000). 상한 초과 시 timeout으로 표시하되 수집은 `lateCaptureMs`(기본 7200000)까지 계속해 완료되면 completed로 갱신.
- SSE: 모든 상태 변화는 기존 turn.updated로 전파.
