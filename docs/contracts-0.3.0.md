---
audience: user
---
# 0.3.0 최소 PoC 계약 제안 (`contracts-0.3.0.md`)

> 상태: **미검증 설계 제안 초안** (구현·배포·패널 시험 제어 없음). 본 문서의 모든 계약은 아직 런타임에서 검증되지 않은 `[제안]`이며, SSE 연결 유지·메모리 재시작 복구·응답 추출 등 미검증 사항은 확정으로 간주하지 않는다(`§5 구현 전 검증 게이트` 참조).

## Why

0.2.3에서 확립된 사용자 로그인(HttpOnly 쿠키 + PASETO `v4.public` 세션 토큰)·Worker→Backend 서비스 토큰(`Purpose=service`) 경계를 유지하면서, 서버 설정으로 지정된 단일 Herdr workspace의 기존 패널 목록·에이전트·상태를 조회하고, 하나의 지정 workspace 전체 타임라인에서 선택 대상에게 메시지를 보내 **해당 요청에 대한 완료 응답만** 수집·저장(Cloudflare D1)·스크롤·검색하는 0.3.0 최소 PoC 계약을 제안한다.

특히 에이전트 턴 실행과 HTTP 요청 수명을 분리하고, Herdr CLI/소켓 스키마(`protocol: 22`)의 실제 지원 범위와 한계(전체 터미널 버퍼 스냅샷과 개별 요청 응답의 구별 불가 문제, 동시성 경쟁, 전송 결과 불명확 시 재전송 금지)를 명확히 규정한다.

---

## What

### 1. 인증·보안 및 지정 Workspace 단일 Allowlist 전제

- **Browser ↔ Worker (`/api/*`) 쿠키 세션 단일 유지 (별도 API Key·새 인증 스택 추가 금지)**:
  - 기존 `/api/login`, `/api/logout`, `/api/session`, `/api/health` 및 쿠키(`biseo_session`, `HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=3600`)·KV 로그인 실패 제한(`LOGIN_ATTEMPTS`)을 그대로 유지한다. 별도의 클라이언트 API Key나 새로운 인증 스택은 만들지 않는다.
  - **모든 신규 REST 및 SSE 경로**(`GET /api/workspaces/:wsId/panes`, `POST /api/timeline/messages`, `GET /api/timeline/messages`, `GET /api/timeline/messages/:requestId`, `GET /api/timeline/stream`)는 동일 출처(`credentials: 'same-origin'`) 쿠키 세션을 통해 `verifySession(c)`(`Purpose=user-session` PASETO 검증)를 통과해야 하며, 미인증 시 `401 {"error":"unauthorized"}`를 반환한다.
  - **소유자(Subject) 범위 고정**: 단일 소유자 세션(`claims.sub === SESSION_SUBJECT`, 기본 `"owner"`)만 허용하며, 타임라인 조회·전송·SSE 구독은 모두 검증된 세션 소유자 범위로 제한한다.
- **Origin Allowlist / CSRF 방어 (상태 변경 REST 요청)**:
  - 쿠키가 `SameSite=Lax`이므로 상태 변경 요청(`POST /api/timeline/messages`, 기존 `POST /api/login`, `POST /api/logout`)에는 **Origin Allowlist 검증**을 적용한다.
  - 요청의 `Origin` 헤더가 존재하고 설정된 허용 출처(`ALLOWED_ORIGINS` 또는 요청 호스트 자신의 `https://<worker-host>` 단일/목록)와 일치할 때만 허용하며, `Origin` 누락 또는 불일치 시 `403 Forbidden {"error":"forbidden","reason":"origin_not_allowed"}`로 즉시 거부한다.
- **Worker ↔ Backend (Tailscale Funnel) 기존 PASETO 서비스 토큰 전 경로 적용**:
  - Worker가 호출하는 **모든 신규 Backend 내부 경로**(`/herdr/workspaces/:wsId/panes`, `/herdr/turns`, `/herdr/turns/:requestId` 등)는 기존과 동일하게 `createServiceToken(c.env)`로 단기 PASETO 서비스 토큰(`Purpose=service`, TTL 300s)을 발급해 `Authorization: Bearer <token>`으로 전달하고, Backend(`src/`)는 `serviceAuth(verify)` 미들웨어로 검증한다 (`401`/`403`).
- **지정 Workspace 서버 설정 Allowlist 단일값 검증 `[제안]`**:
  - 조회·전송·타임라인·SSE 대상 workspace는 클라이언트 입력을 신뢰하지 않고 서버 설정(`ALLOWED_WORKSPACE_ID`, 단일값)과 대조 검증한다.
  - 요청의 `workspaceId`가 설정된 단일 allowlist 값과 일치하지 않으면 즉시 `403 Forbidden {"error":"forbidden","reason":"workspace_not_allowed"}`로 거부한다.
- **비밀·토큰·전체 터미널 덤프 비노출 원칙 (과도한 임의 DLP 추가 금지)**:
  - 로그·오류 응답·D1 테이블에는 **비밀키, PASETO 토큰, 쿠키 원문, 비밀번호 검증값, 그리고 정제되지 않은 전체 터미널 버퍼 덤프(raw terminal scrollback dump)**를 절대 기록하지 않는다.
  - 단, 프롬프트나 완료 응답 본문에 대해 임의의 정규식 마스킹/DLP 필터 계층을 과도하게 신설하지 않으며, 결정론적으로 분리된 완료 응답이 아닐 때 저장 자체를 거부(`capture_unavailable`, `response_text = NULL`)하는 구조적 경계로 보호한다.

---

### 2. Herdr 어댑터 계약 및 실제 지원 근거 (`herdr` CLI / API `protocol: 22`)

#### 2.1 실행 컨텍스트와 전체 패널·에이전트 조회 근거 (스키마 확인됨, 런타임 미검증)
- **CLI / 소켓 전제**: `herdr` 실행에는 대상 Herdr 세션 소켓 접근 권한이 필요하다 (`[미확인: PM2 백엔드 데몬의 HERDR 소켓/세션 접근 환경]`).
- **Workspace 전체 패널·에이전트 조회**:
  - `herdr pane list --workspace <workspace_id>` (`pane.list`, `PaneListParams: { workspace_id }`): 지정 workspace의 **모든 기존 패널**(에이전트 유무 무관)을 `PaneInfo[]`로 반환한다.
    - `PaneInfo` 필수 필드: `pane_id`, `terminal_id`, `workspace_id`, `tab_id`, `focused`, `agent_status`(`idle | working | blocked | done | unknown`), `revision`(`uint64`).
    - `PaneInfo` 선택(nullable/optional) 필드: `label`, `title`, `terminal_title`, `terminal_title_stripped`, `agent`(`string | null`), `display_agent`(`string | null`), `agent_session`(`{ source, agent, kind, value } | null`).
  - `herdr agent list` (`agent.list`): 현재 활성 에이전트 목록(`AgentInfo[]`)을 반환한다.
    - `AgentInfo` 필수 필드: `terminal_id`, `agent_status`, `workspace_id`, `tab_id`, `pane_id`, `focused`, `revision`.
    - `AgentInfo` 선택(optional) 필드: `name`(`string | null`), `agent`(`string | null`), `display_agent`, `agent_session`, `interactive_ready`(`boolean`, optional), `launch_pending`(`boolean`, optional), `state_change_seq`(`uint64`), `completion_seq`(`uint64 | null`).
  - **어댑터 조합 규칙 `[제안]`**: `pane list --workspace <ALLOWED_WORKSPACE_ID>` 결과를 기준으로 `agent list`를 `pane_id`로 조인하여, 패널 표시 이름(`label ?? title ?? terminal_title_stripped ?? pane_id`), 에이전트 종류/이름(`agent`, `display_agent`, `name`), 세션 식별자(`terminal_id`, `agent_session`), 상태(`agent_status`, 제공 시 `interactive_ready`/`launch_pending`)를 구성한다.

#### 2.2 대상 상태별 전송 가능 판정 및 거부 사유 계약 `[제안]`

- **`interactive_ready` / `launch_pending` 보조 판정 규칙 (중요)**:
  - `AgentInfo` 스키마에서 `interactive_ready`와 `launch_pending`은 `required` 목록에 없는 **에이전트 종류별 optional 필드**다(예: Claude·Codex 등에서는 응답에 생략될 수 있음).
  - 따라서 필드가 생략(`undefined`)된 경우를 `false`로 단정해 차단하면 정상 에이전트까지 모두 막히므로, **해당 필드가 명시적으로 제공된 경우에만 보조 판정(`interactive_ready === false` 이면 불가, `launch_pending === true` 이면 busy)으로 사용**하고, 생략된 경우에는 `agent !== null` 및 `agent_status`로만 판정한다.

| 판정 구분 | Herdr 상태 조건 (`PaneInfo` + `AgentInfo`) | UI 동작 | 서버 거부 HTTP / `reason` 코드 `[제안]` |
|---|---|---|---|
| **전송 가능 (`sendable: true`)** | `agent !== null` 이고 `agent_status in ('idle', 'done')` 이며, `interactive_ready !== false` 이고 `launch_pending !== true` | 대상 선택·전송 활성 | — (정상 접수 `202 Accepted`) |
| **작업 중 (`busy`)** | `agent_status === 'working'` 또는 `launch_pending === true` (또는 서버 내 해당 `paneId` 활성 턴 잠금 존재) | 선택/전송 비활성 + 상태 배지 | `409 Conflict` / `agent_busy` |
| **승인·질문 대기 (`blocked`)** | `agent_status === 'blocked'` (`herdr agent prompt`도 `agent_blocked`로 거부) | 선택/전송 비활성 + 사유 표시 | `409 Conflict` / `agent_blocked` |
| **상태 미식별·미준비 (`unknown`)** | `agent_status === 'unknown'` 또는 `interactive_ready === false` | 선택/전송 비활성 + 사유 표시 | `409 Conflict` / `agent_unknown` |
| **에이전트 없음 (`no_agent`)** | 일반 셸 패널 (`agent === null` 및 `AgentInfo` 매칭 없음) | 목록에 표시하되 전송 비활성 | `409 Conflict` / `no_agent_in_pane` |
| **패널 부재/세션 변경** | `paneId`가 지정 workspace에 없거나, 제출 직전 재확인에서 `terminal_id`/`agent`/`agent_session`이 변경됨 | 목록 갱신 후 비활성 | `404 Not Found` / `target_not_found` (세션 교체 시 `409` / `agent_session_changed`) |

#### 2.3 패널 잠금(Pane Lock) · 세션 식별 재확인 · 전송 경쟁 잔여 한계 `[제안]`
1. **Pane Lock + 제출 직전 세션 식별 재확인**:
   - Backend와 Worker(D1)는 `paneId`당 동시에 1개의 활성 턴(`queued | working`)만 허용하는 **in-flight pane lock**을 유지한다.
   - `herdr agent prompt` 호출 직전에 `herdr agent get <paneId>`(및 `pane get <paneId>`)를 재조회하여, 요청 시점의 `terminal_id`, `agent` 종류, `agent_session.value`(존재 시), 그리고 `agent_status in ('idle', 'done')`가 그대로 유지되는지 재확인한다. 에이전트가 종료·교체되었으면 전송하지 않고 `409 Conflict (reason: "agent_session_changed")`로 거부한다.
2. **전송 경쟁(TOCTOU) 잔여 한계 명시**:
   - Herdr의 `agent.prompt`는 조건부 원자적 제출(compare-and-prompt on `revision`/`state_change_seq`) 파라미터를 지원하지 않는다.
   - 따라서 `agent.get` 재확인 직후와 `agent.prompt` 바이트 기록 사이의 수 밀리초 구간에 사용자가 TUI에서 직접 입력하거나 에이전트가 스스로 상태 전이를 일으키는 외부 경쟁(race condition)은 **완전히 제거할 수 없는 잔여 한계**다.

#### 2.4 제출과 완료 대기: 단독 `wait` 조기 종료 방지 및 Activity Gate `[제안]`
- **`agent wait` 단독 호출의 조기 종료 위험 (확인됨)**:
  - `herdr` 스킬에 따르면 `herdr agent prompt`는 텍스트와 Enter가 기록되면 즉시 성공(`agent_prompted`)을 반환하지만, **그것만으로 에이전트가 새 턴(`working`)을 시작했음을 보장하지 않는다**.
  - 만약 `agent prompt`(no `--wait`) 직후 에이전트가 아직 `idle`/`done`인 상태에서 별도로 `herdr agent wait <target>`를 호출하면, `agent wait`는 현재의 `idle`/`done`을 정착 상태로 보고 **턴이 시작되기도 전에 즉시 반환(조기 종료)**해 버린다.
- **Activity Gate 필수 계약 `[제안]`**:
  - 백엔드 비동기 작업은 다음 두 방식 중 하나로만 완료를 판정해야 한다:
    1. **권장**: 백엔드 백그라운드 태스크에서 `herdr agent prompt <paneId> <text> --wait --timeout <ms>`를 실행한다. Herdr가 내부적으로 제출 후 최대 5초 동안 `working` 또는 `blocked` 활동 전이(Activity Gate)를 감시하며, 활동이 없으면 `agent_prompt_stalled` 오류를 반환하고, 활동이 관찰된 뒤 첫 정착 상태(`idle | done | blocked`)까지 대기한다.
    2. **분리 호출 시**: 제출 전 `baseline_state_change_seq`와 `baseline_completion_seq`를 기록하고, 먼저 5초 이내에 `agent_status in ('working', 'blocked')` 활동이 실제 관찰될 때까지 대기(Activity Gate)한 뒤에야 정착 상태(`idle | done` 또는 `completion_seq` 증가)를 기다린다. 5초 내 활동이 없으면 `agent_prompt_stalled`로 실패 처리한다.

#### 2.5 핵심 문제: 해당 요청의 응답과 전체 터미널 로그 구별 가능 여부
- **사실 확인 (Herdr `agent.read` / `pane.read`만으로는 결정론적 구별 불가)**:
  1. Herdr의 `agent.read` / `pane.read`는 개별 프롬프트 턴의 구조화된 응답이 아니라 **터미널 화면·스크롤백 버퍼의 텍스트 스냅샷**(`visible | recent | recent_unwrapped | detection`, `revision`, `truncated`)만 반환한다.
  2. 에이전트 TUI의 상태 표시줄 갱신, 스피너 잔상, 프롬프트 에코, 도구 실행 로그, 이전 턴 출력, alternate-screen 전환 등이 모두 같은 터미널 버퍼에 섞이므로, **전후 텍스트 snapshot diff나 전체 터미널 스냅샷은 해당 요청의 순수 완료 응답과 100% 구별할 수 없다**.
- **폴백 금지 및 `capture_unavailable` 종료 계약 (중요)**:
  - 사용자 요구("해당 요청의 응답을 전체 터미널 로그와 구별", "완료 응답만 표시") 및 보안 원칙(D1에 전체 터미널 덤프 저장 금지)에 따라, **불확실한 터미널 버퍼 snapshot diff나 전체 터미널 스냅샷을 정상 완료 답변(`status: "completed"`)으로 저장하거나 UI에 표시하는 폴백은 금지한다**.
  - 해당 요청의 완료 응답만 결정론적으로 분리·검증할 수 없는 경우, 턴은 정착되었더라도 응답 수집 불가 상태인 **`status: "capture_unavailable"`** (`errorCode: "response_capture_unavailable"`, `responseText: null`)로 종료·저장하고 UI에는 고정 안내 문구만 표시한다.
- **구조화된 응답 수집 어댑터: 구현 전 검증 게이트 `[미확인 / 제안]`**:
  - 에이전트별 세션 트랜스크립트(`PaneInfo.agent_session`: `kind: "id" | "path"`, `value`) 또는 에이전트 공식 출력 채널에서 요청-응답 턴을 결정론적으로 추출할 수 있는지 여부는 **구현 전 별도 검증 게이트(`§5`)**를 통과해야만 `status: "completed"` 어댑터로 채택한다.

---

### 3. 장기 작업 HTTP 수명 분리 및 REST · SSE 최소 계약 `[제안 / 미검증]`

#### 3.1 Worker 공개 API (Browser ↔ Worker, 쿠키 세션 인증 + 단일 Workspace 검증)

| 메서드·경로 | 역할 | 인증·보안 검증 | 요청 파라미터 / 본문 | 응답 (성공 / 실패) |
|---|---|---|---|---|
| `GET /api/workspaces/:wsId/panes` | 지정 workspace의 전체 패널·에이전트·전송 가능 여부 조회 | `verifySession` + `wsId === ALLOWED_WORKSPACE_ID` | Path: `wsId` | `200 { workspaceId, panes: PaneSummary[] }` / `401`, `403`, `502` |
| `POST /api/timeline/messages` | 대상 패널 에이전트에 메시지 전송 접수 (수명 분리, `requestId` 멱등) | `verifySession` + `Origin` Allowlist + `workspaceId` Allowlist | `{ requestId, workspaceId, paneId, text }` | `202 { requestId, status: "queued" \| "working", createdAt }` (멱등 재호출 시 기존 상태 반환) / `400`, `401`, `403`, `404`, `409`, `500`, `502` |
| `GET /api/timeline/messages` | 지정 workspace 전체 타임라인 스크롤·검색 조회 (D1) | `verifySession` + `workspaceId` Allowlist | Query: `workspaceId`, `cursor?`, `limit?`(기본 30, 최대 100), `q?`(리터럴 검색어), `paneId?` | `200 { items: TimelineItem[], nextCursor: string \| null }` / `400`, `401`, `403`, `500` |
| `GET /api/timeline/messages/:requestId` | 단건 요청 상태·완료응답 조회 (재접속/폴백 확인) | `verifySession` + 소유자/workspace 범위 검증 | Path: `requestId` | `200 TimelineItem` / `401`, `404`, `500` |
| `GET /api/timeline/stream` | 타임라인 턴 상태 전이 및 패널 상태 알림 SSE `[미검증 제안]` | `verifySession`(동일 출처 쿠키) + `workspaceId` Allowlist | Query: `workspaceId`, Header: `Last-Event-ID?` (`<seq>`) | `200 text/event-stream` (`id: <seq>`, `event: turn.updated`, `event: pane.updated`, `event: heartbeat`) / `401`, `403`, `500` |

- **`PaneSummary` 계약 `[제안]`**:
  ```json
  {
    "paneId": "w1T:p2",
    "tabId": "w1T:t1",
    "name": "opus",
    "agentKind": "claude",
    "agentName": "opus",
    "status": "idle",
    "sendable": true,
    "disabledReason": null,
    "revision": 42
  }
  ```
  - `disabledReason`: `"agent_busy" | "agent_blocked" | "agent_unknown" | "no_agent_in_pane" | null`.
- **`TimelineItem` 계약 `[제안]`**:
  ```json
  {
    "requestId": "req_01J...",
    "workspaceId": "w1T",
    "paneId": "w1T:p2",
    "targetName": "opus",
    "agentKind": "claude",
    "promptText": "상태 요약 요청",
    "status": "completed",
    "responseText": "...",
    "errorCode": null,
    "createdAt": "2026-10-28T12:30:00.000Z",
    "seq": 104,
    "completedAt": "2026-10-28T12:30:14.200Z"
  }
  ```
  - `status` 허용값: `"queued" | "working" | "completed" | "capture_unavailable" | "blocked" | "failed" | "timeout"`.
  - **완료 응답만 표시·진행 spinner 규칙**: 중간 출력 스트리밍은 전송·저장하지 않는다. `status`가 `"queued" | "working"`인 동안 UI는 **진행 spinner**만 표시하고, 종결 상태 도달 시 검증된 `responseText`(`completed`인 경우만) 또는 상태/사유 배지(`capture_unavailable`, `blocked`, `failed`, `timeout`)를 표시한다.

#### 3.2 요청 ID · 동시 INSERT/본문 충돌 · 전송 결과 불명확 시 재전송 금지 · 시간 초과 · SSE 재접속 계약 `[제안]`

1. **요청 ID (`requestId`) 동시 INSERT 원자성 및 중복 본문 충돌 처리**:
   - 클라이언트는 메시지 생성 시 고유 `requestId`(UUIDv4/ULID)를 생성해 전송한다.
   - Worker는 SELECT 후 INSERT(TOCTOU 취약) 대신 D1에 `INSERT INTO timeline_turns (...) VALUES (...) ON CONFLICT(request_id) DO NOTHING`을 먼저 실행한다.
   - 충돌(이미 동일 `requestId` 존재) 시 기존 행을 조회하여:
     - 요청의 `(workspaceId, paneId, promptText)`가 기존 행과 **완전히 일치**하면 Herdr로 재전송하지 않고 기존 레코드 상태를 그대로 반환한다(멱등 응답 `200 OK` 또는 진행 중 `202 Accepted`).
     - 동일 `requestId`인데 `(workspaceId, paneId, promptText)` 중 하나라도 **다르면** `409 Conflict {"error":"conflict","reason":"request_id_payload_mismatch"}`로 즉시 거부한다.
2. **동일 패널 중복 실행 차단**:
   - D1에서 동일 `pane_id`에 `status IN ('queued', 'working')`인 행이 존재하면 새 `requestId` 삽입을 거부하고 `409 Conflict {"error":"target_not_ready","reason":"agent_busy"}`를 반환한다(유니크 부분 인덱스 `CREATE UNIQUE INDEX idx_turns_active_pane ON timeline_turns(pane_id) WHERE status IN ('queued', 'working')`로 DB 수준 원자성 보장 `[제안]`).
3. **전송 결과 불명확(indeterminate) 시 재전송 금지 규칙 (중요)**:
   - Worker → Backend(`/herdr/turns`) 호출 중 네트워크 단절·`502`/`504` 타임아웃이 발생하거나, Backend에서 `herdr agent prompt` 실행 중 `timeout` / `agent_prompt_stalled`가 발생한 경우, **프롬프트가 실제 에이전트 터미널에 전달되었는지 여부는 불명확(indeterminate)**하다.
   - `herdr` 스킬 규칙("A timeout or stalled response does not prove the prompt was never delivered; do not blindly submit it again")에 따라, **Worker와 클라이언트는 자동 재시도(`retry: 0`)나 동일 프롬프트 자동 재전송을 절대 수행하지 않는다**.
   - 해당 턴은 `status = "failed"`, `errorCode = "delivery_uncertain"`(또는 `"agent_prompt_stalled"`)으로 기록하고, 사용자가 패널 상태를 다시 확인한 뒤 수동으로 판단하게 한다.
4. **시간 초과 (`timeout`) 및 Workers 런타임 수명 한계 (근거 명확화)**:
   - **Cloudflare Workers 런타임 수명 사실 근거**: Cloudflare Workers 공식 Limits 기준, 클라이언트가 연결을 유지하는 동안에는 HTTP 요청/SSE 연결 자체에 고정된 hard wall-clock duration limit(예: 임의의 100초 단정)이 없다. 반면 응답이 반환되거나 클라이언트 연결이 끊긴 뒤 실행되는 **`ctx.waitUntil()` 백그라운드 작업은 최대 30초**까지만 허용된다.
   - 따라서 장시간(수십 초~수 분) 소요되는 에이전트 턴 대기를 Worker의 `ctx.waitUntil()`에만 의존할 수 없으며, `POST /api/timeline/messages`는 `202 Accepted`로 즉시 분리하고 실제 대기 루프는 로컬 Backend(`src/`)가 수행하되, 클라이언트는 SSE(유휴 연결 종료 대비 주기적 heartbeat + 끊김 시 재연결) 및 D1 상태 조회로 완료를 수신해야 한다.
   - **제출 Activity Gate (5초)**: 제출 후 5초 내 `working`/`blocked` 활동이 관찰되지 않으면 `status = "failed"`, `errorCode = "agent_prompt_stalled"`로 종료한다.
   - **턴 완료 제한시간 (`TURN_TIMEOUT_MS`)**: 설정된 제한시간 초과 시 백엔드 대기를 종료하고 `status = "timeout"`, `errorCode = "turn_timeout"`으로 기록한다. 에이전트 프로세스 자체는 계속 실행 중일 수 있으므로, 다음 전송 전 `pane.list`/`agent.list`에서 `working` 상태면 계속 `agent_busy`로 차단된다.
5. **SSE 인증 · `Last-Event-ID` 재접속 · 백엔드 재시작 시 한계 `[미검증 제안]`**:
   - **SSE 인증 및 소유자 범위**: 브라우저 `EventSource('/api/timeline/stream?workspaceId=...')`는 동일 출처의 `biseo_session` HttpOnly 쿠키를 자동 포함하며, Worker는 스트림 시작 전 `verifySession(c)`, `claims.sub === SESSION_SUBJECT`, `workspaceId === ALLOWED_WORKSPACE_ID`를 모두 검증한다.
   - **`Last-Event-ID` 기반 재접속 복구**: 각 `turn.updated` SSE 이벤트는 D1의 단조 증가 `seq`를 이벤트 ID(`id: <seq>`)로 포함한다. 네트워크/프록시 유휴 종료로 `EventSource`가 재연결될 때 브라우저가 `Last-Event-ID: <last_seq>` 헤더를 보내면, Worker는 D1에서 `WHERE workspace_id = ?1 AND seq > ?2 ORDER BY seq ASC`로 누락된 변경분을 먼저 전송하거나, 클라이언트가 재연결 시 `GET /api/timeline/messages` 및 `GET /api/workspaces/:wsId/panes`를 호출해 상태를 동기화한다.
   - **백엔드 재시작 한계 명시**: Backend(`src/`)가 인메모리에서 턴을 대기하던 중 PM2 재시작·크래시가 발생하면 진행 중이던 대기 컨텍스트는 유실된다(메모리 재시작 자동 복구는 미검증·미지원). 이 경우 D1에 `working`으로 고착된 행은 만료 시간(`created_at + TURN_TIMEOUT_MS`) 경과 시 `status = "failed"`, `errorCode = "backend_interrupted"`로 정리(reconcile)하여 패널 영구 잠금을 해제한다 `[제안]`.

---

### 4. Cloudflare D1 단일 Workspace 타임라인 · Fail-Closed · 스크롤 · 리터럴 검색 계약 `[제안]`

- **D1 바인딩 누락/오류 시 Fail-Closed 원칙**:
  - `c.env.BISEO_DB` 바인딩이 누락되었거나 D1 쿼리 실패 시, 요청을 임의로 통과시키거나 인메모리로 우회하지 않고 즉시 **`500 Internal Server Error {"error":"storage_unavailable"}`로 fail-closed 거부**한다 (`POST /api/timeline/messages`의 경우 D1에 `queued` 행이 기록되기 전에는 절대 Backend `/herdr/turns`를 호출하지 않는다).
- **단일 지정 Workspace 전체 타임라인 원칙**:
  - 모든 메시지와 완료 응답은 개별 패널별로 파편화하지 않고, 지정된 `workspace_id`의 **단일 통합 타임라인(`timeline_turns`)**에 시간·순번 순으로 저장·조회한다(선택적으로 특정 `paneId` 필터링 가능).
- **최소 테이블 스키마 (`timeline_turns`)**:
  ```sql
  CREATE TABLE IF NOT EXISTS timeline_turns (
    seq INTEGER PRIMARY KEY AUTOINCREMENT,
    request_id TEXT NOT NULL UNIQUE,
    workspace_id TEXT NOT NULL,
    owner_subject TEXT NOT NULL,
    pane_id TEXT NOT NULL,
    target_session_ref TEXT,
    target_name TEXT NOT NULL,
    agent_kind TEXT,
    prompt_text TEXT NOT NULL,
    response_text TEXT,
    status TEXT NOT NULL CHECK (
      status IN ('queued', 'working', 'completed', 'capture_unavailable', 'blocked', 'failed', 'timeout')
    ),
    error_code TEXT,
    created_at TEXT NOT NULL,
    completed_at TEXT
  );
  CREATE INDEX IF NOT EXISTS idx_turns_ws_seq
    ON timeline_turns (workspace_id, seq DESC);
  CREATE UNIQUE INDEX IF NOT EXISTS idx_turns_active_pane
    ON timeline_turns (pane_id) WHERE status IN ('queued', 'working');
  ```
- **신규 삽입에도 흔들리지 않는 커서 기반 스크롤 계약**:
  - 오프셋(`OFFSET`) 페이징은 스크롤 도중 신규 메시지가 삽입되면 행이 밀려 중복·누락이 발생하므로 사용하지 않는다.
  - 단조 증가하는 `seq`(`INTEGER PRIMARY KEY AUTOINCREMENT`)를 커서(`cursor = "<seq>"`)로 사용한다.
  - 초기 로드는 최신 `limit`건(`WHERE workspace_id = ?1 AND owner_subject = ?2 ORDER BY seq DESC LIMIT ?3`)을 조회하고, 과거 이력 스크롤은 `WHERE workspace_id = ?1 AND owner_subject = ?2 AND seq < ?3 ORDER BY seq DESC LIMIT ?4`로 조회하여 **신규 턴이 계속 삽입되어도 과거 페이지 커서가 절대 흔들리지 않도록 보장**한다.
- **검색 범위 및 리터럴 검색 이스케이프 계약 (`q` 파라미터)**:
  - **검색 대상 범위**: 지정 `workspace_id` 및 `owner_subject`의 전체 타임라인 행 중 `prompt_text`, `response_text`(`completed`인 경우), `target_name`, `pane_id`를 대상으로 한다(단일 커서 `seq < ?`와 결합 가능).
  - **리터럴 검색 이스케이프**: 사용자 검색어 `q`에 포함된 SQL 와일드카드 문자(`\`, `%`, `_`)가 패턴으로 오작동하지 않도록 서버에서 먼저 `q.replace(/[\\%_]/g, '\\$&')`로 이스케이프한 뒤, 바인딩 파라미터로 `LIKE '%' || ? || '%' ESCAPE '\'`를 실행한다.

---

### 5. 구현 전 검증 게이트 (미확인 사항 — 확정 금지)

본 문서는 설계 제안이며, 실제 0.3.0 코드 구현에 착수하기 전에 아래 3가지 미확인 항목을 별도 검증해야 한다.

1. **`[미확인 게이트 1]` 개별 요청의 완료 응답 결정론적 분리 방법**:
   - Herdr `agent.read`는 전체 터미널 버퍼 스냅샷만 반환하므로 그대로 쓸 수 없다. `PaneInfo.agent_session`(`source`, `kind`, `value`)이 가리키는 에이전트 세션 로그나 기타 결정론적 채널에서 해당 프롬프트의 최종 응답만 오염 없이 분리 가능한지 먼저 검증해야 한다. 검증 전까지는 `capture_unavailable` 계약만 유효하다.
2. **`[미확인 게이트 2]` PM2 데몬의 Herdr 소켓/세션 접근성**:
   - PM2에서 실행되는 Node.js 서버(`src/index.ts`)가 `HERDR_ENV=1` 밖에서 로컬 Herdr 소켓(`herdr --session ...`)을 호출할 수 있는지, 권한·환경변수 경계를 확인해야 한다.
3. **`[미확인 게이트 3]` Worker ↔ Funnel SSE 유휴 종료 및 재연결 동작**:
   - Cloudflare Workers는 연결이 살아 있는 동안 고정된 hard duration limit을 두지 않으나(`ctx.waitUntil`은 분리 후 30초 제한), 브라우저·Cloudflare Edge·Tailscale Funnel 구간의 유휴(idle) 연결 종료 특성에 맞춰 SSE heartbeat 주기와 `Last-Event-ID` 재연결 복구 동작을 실측해야 한다.

---

## How: `ui / app / domain / infra` 파일 경계 제안

모든 모듈은 `implement-small-modules`(`<= 128`줄, `<= 1024`자)와 `design-layered-architecture`(`ui → app → domain ← infra`)를 따르도록 아래와 같이 책임을 나눈다.

| 런타임 | 레이어 | 파일 경로 (제안) | 단일 책임 및 계약 |
|---|---|---|---|
| **shared** | `domain` | `shared/domain/timeline.ts` | `PaneStatus`, `DisabledReason`, `TurnStatus`(`capture_unavailable` 포함), `PaneSummary`, `TimelineItem` 타입 및 보조 필드(`interactive_ready`/`launch_pending` optional) 반영 `canSendPrompt` 순수 함수 |
| **src (Backend)** | `domain` | `src/domain/workspace-guard.ts` | 단일 allowlist `ALLOWED_WORKSPACE_ID` 일치 검증 및 패널 세션 동일성(`terminal_id`/`agent_session`) 판정 순수 규칙 |
| **src (Backend)** | `app` | `src/app/herdr-ports.ts` | `HerdrPort`(`listWorkspacePanes`, `getAgentTarget`, `promptAndWait`), `ResponseCapturePort`(검증 게이트 통과 시 구조화 응답 추출, 미지원 시 `capture_unavailable`) 인터페이스 |
| **src (Backend)** | `app` | `src/app/list-panes.ts` | allowlist 검증 후 `pane list` + `agent list` 조인 및 `sendable`/`disabledReason` 계산 유스케이스 |
| **src (Backend)** | `app` | `src/app/run-turn.ts` | in-flight pane lock 확인 → 세션 재확인 → Activity Gate 포함 실행 → 응답 추출 또는 `capture_unavailable` 판정 유스케이스 (재전송 금지) |
| **src (Backend)** | `infra` | `src/infra/herdr-cli.ts` | `node:child_process.execFile('herdr', ...)` 기반 `HerdrPort` 구현 (배열 인자 전달로 쉘 인젝션 방지) |
| **src (Backend)** | `ui` | `src/ui/herdr-routes.ts` | `/herdr/workspaces/:wsId/panes`, `/herdr/turns`, `/herdr/turns/:requestId` Hono 라우트 (모든 경로 기존 `serviceAuth` PASETO 검증 적용) |
| **worker** | `domain` | `worker/domain/search-escape.ts` | SQLite `LIKE ... ESCAPE '\'` 용 리터럴 검색어 이스케이프(`escapeLikeLiteral`), `Origin` allowlist 판정 및 커서(`seq`) 파싱 순수 함수 |
| **worker** | `app` | `worker/app/timeline-ports.ts` | `TimelineRepoPort`(D1 원자적 INSERT, 활성 패널 잠금, `seq` 커서 조회·검색), `HerdrUpstreamPort` 인터페이스 |
| **worker** | `app` | `worker/app/submit-message.ts` | workspace allowlist 검증, D1 바인딩 누락 fail-closed(`500`), `requestId` 멱등/본문 충돌(`409`) 판정, 활성 패널 중복 차단(`409`), upstream 실패 시 재전송 금지(`delivery_uncertain`) 처리 |
| **worker** | `infra` | `worker/infra/d1-timeline-repo.ts` | Cloudflare D1(`BISEO_DB`) 기반 `TimelineRepoPort` 구현 (비밀·토큰·전체 터미널 덤프 저장 금지) |
| **worker** | `infra` | `worker/infra/herdr-upstream.ts` | `ky`(`retry: 0`) + 기존 `createServiceToken` 기반 Backend 호출 어댑터 |
| **worker** | `ui` | `worker/ui/timeline-routes.ts` | `/api/workspaces/:wsId/panes`, `/api/timeline/messages`, `/api/timeline/stream` 라우트 (`verifySession` 쿠키 세션 + POST `Origin` allowlist + `Last-Event-ID` 적용) |
| **web** | `domain` | `web/domain/timeline.ts` | 프론트엔드 타임라인·패널 상태 타입 및 `TimelinePort` 인터페이스 |
| **web** | `infra` | `web/infra/timelineApi.ts` | `ky`(`retry: 0`, `credentials: 'same-origin'`) REST 호출 및 `EventSource` 구독 어댑터 |
| **web** | `app` | `web/app/useTimeline.ts` | 패널 목록·선택, 전송(`requestId` 생성, 자동 재전송 금지), 진행 spinner, `seq` 커서 스크롤·검색, SSE 재접속 동기화 훅 |
| **web** | `ui` | `web/ui/PaneSelector.tsx` | 패널 목록·상태 배지·비활성 사유 표시 컴포넌트 (문구는 `web/resources.json` 분리) |
| **web** | `ui` | `web/ui/TimelineView.tsx` | 단일 타임라인 목록, 진행 spinner, 완료 응답/`capture_unavailable` 표시, 검색·커서 스크롤 컴포넌트 |
