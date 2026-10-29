# 연결 안정화 (0.3.0)

경로: 브라우저 → Worker(`biseo.qus0in.workers.dev`) → Tailscale Funnel → 백엔드(Hono, PM2).

## 원인 후보

1. Funnel/Edge 구간 유휴(idle) 연결 종료 — 장시간 무전송 시 중간 프록시가 끊음.
2. 백엔드 순간 장애(타임아웃·5xx) — 패널·턴 조회(GET) 1회 실패가 UI 오류로 직결.
3. 재연결 시 상태 누락 — SSE 재접속 후 끊긴 사이 변경분 미수신.

## 조치

- Worker upstream GET만 재시도(최대 2회, 지수 백오프 ~300ms~): `worker/infra/herdr-upstream-retry.ts`.
  타임아웃(`retryOnTimeout`)·5xx(`afterResponse` 강제 재시도)·네트워크 오류만.
  마지막 시도 원응답 유지(`retryCount<2`)로 상태코드 보존.
  POST·DELETE는 재시도 금지(멱등 아님, 계약 `contracts-0.3.0.md §3.2.3` 재전송 금지 준수).
- SSE 양단 `retry: 3000` 전송: 백엔드 스냅샷(`src/ui/events-sse.ts`), Worker 중계 프리앰블(`worker/ui/sse-bounded-stream.ts`, 바이트 중계라 heartbeat 통과).
- 이벤트 id: `turn.updated`만 `id: <seq>` 유지. 스냅샷은 무id(클라이언트 커서 보존).
- `Last-Event-ID` 수신(헤더 또는 `?lastEventId=`) 시 스냅샷 재전송 + `"resumedFrom":"<cursor>"` 표시(`src/ui/events-route.ts`).
- heartbeat 15초 유지: Funnel/Edge 유휴 종료 대비에 충분, Workers는 활성 연결 hard limit 없음. 종료 사유 로그 유지.

## 로그로 확인하는 방법

- 재시도 추적(`x-request-id` 동일): `worker.upstream.retry`(`retryCount` 1·2) → `worker.upstream`(최종 상태, `durationMs`에 재시도 포함).
- 종료 원인 대조: Worker `worker.sse.close`(`client_abort`/`upstream_closed`/`error`) vs 백엔드 `sse.close`(`client_abort`/`write_error`/`heartbeat_error`/`upstream_closed`).
- 확인 명령: `wrangler tail | grep -E 'worker\.upstream|sse\.close'` (requestId로 묶어 대조).

## 남은 문제

- 백엔드 store가 메모리라 재연결 재전송은 스냅샷까지만(턴 seq 따라잡기 미지원). D1 따라잡기는 Worker 측 제안(계약 §3.2.5) 그대로 미구현.
- POST 실패(`delivery_uncertain`)는 자동 재전송 없이 수동 확인(계약 §3.2.3).
