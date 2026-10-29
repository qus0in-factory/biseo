# 제공자 사용량 한도 vs 패널 가용성 조사 (#32)

조사일 2026-10-29, 읽기 전용. 대화 본문은 열람·인용하지 않고 이벤트 키만 확인했다.

## 결론
- 실행 상태(Herdr idle/working)는 가용성 근거가 아니다. 별도 `availability` 축으로 분리한다.
- 구조화 출처는 **codex만 확인**됐다. claude·opencode·agy는 미확인이다.
- 미확인은 `unknown`으로 표시하고 전송을 막지 않는다. 한도 확인(`limited`)일 때만 차단한다.

## 출처별 표
| 제공자 | 출처 | 신뢰도 | 필드 | 갱신 시점 | 개인정보 위험 |
|---|---|---|---|---|---|
| codex | rollout JSONL `token_count.rate_limits` (`~/.codex/sessions/**`) | 높음(구조화) | `primary/secondary.{used_percent,window_minutes,resets_at}`, `rate_limit_reached_type`, `credits`, `plan_type` | 턴마다 기록. 유휴 중엔 갱신 없음 | 같은 파일에 대화 본문이 있다. 키 화이트리스트 파싱만 하고 줄 원문은 보관하지 않는다 |
| codex | 화면 '5h limit' 경고 | 낮음(표시 문구) | 없음 | 화면 갱신 때 | 화면 덤프 금지 |
| claude | `claude stats`(사용 통계), `~/.claude/policy-limits.json`(조직 정책) | 한도 도달·재개 시각 용도로는 미확인 | 한도 필드 없음 | - | 홈 파일에 개인 정보가 있다 |
| opencode | `opencode stats`(토큰·비용 집계) | 한도 필드 미확인 | - | - | 낮음 |
| agy | `agy --help`에 한도·사용량 명령 없음 | 미확인 | - | - | - |
| herdr | `agent_status`(working/idle/blocked) | 실행 상태만 | - | - | 낮음 |

## 현재 사례
- ga(agy): 한도인데 herdr는 idle. 구조화 출처가 없어 자동 판정은 불가하다.
- sol(codex): 화면에 '5h limit'이 보인다. 해당 rollout의 `token_count`는 29건, `rate_limits` 키가 존재한다. `rate_limit_reached_type`은 샘플에서 null이었다.

## 오탐·미탐 위험
- rollout 값은 마지막 턴의 스냅샷이다. `resets_at`이 지났으면 만료로 처리하고 `unknown`으로 되돌린다.
- `used_percent`가 100 미만이어도 다른 윈도가 막혔을 수 있다. `rate_limit_reached_type`이 non-null일 때만 `limited`로 본다.
- 네트워크 단절, 승인 대기, 일시 오류를 한도로 오인하지 않는다. 한도 문구는 구조화 필드 또는 수동 확인만 인정한다.
- 화면 문구 매칭은 오탐 가능성이 높다. 자동 차단 근거로 쓰지 않는다.

## 권장 설계
- domain: `Availability = available | limited{reason,resetsAt,source,checkedAt} | unknown`
- infra 어댑터(제공자별):
  - codex: 해당 pane의 rollout 파일에서 마지막 `token_count`를 읽는다. 화이트리스트 필드만 추출한다.
  - 나머지: 수동 확인 입력. 만료 TTL을 두고 기본값은 `unknown`.
- app: 상태 축을 분리해 SSE 스냅샷에 `availability`를 추가한다. 화면 덤프·본문은 웹 응답·로그·D1에 저장하지 않는다.
- 전송 차단은 `limited`이고 `resetsAt` 이전일 때만 한다. `unknown`은 차단하지 않는다.
- TDD: codex 어댑터 fixture(키만 있는 합성 JSONL)로 limited/만료/null/손상 줄을 테스트한다.

## 결정 기록 (2026-10-29, feat/32-ttl)
- 스냅샷 시각: rollout 줄의 최상위 `timestamp`만 추출해 `RateLimits.snapshotAt`에 둔다. 원문·본문은 보관하지 않는다.
- `checkedAt`은 확인 시각이 아니라 **데이터 기준 시각**(= `snapshotAt`)이다. 확인 시각은 `observedAt`에 둔다.
- `rate_limit_reached_type`이 null이면 `available`이 아니라 `unknown`이다. 스냅샷은 "그 시점에 한도 미도달"만 뜻하지 않는다.
- TTL: `config/runtime.json`의 `availabilityTtlMs`(기본 900000ms=15분). 코드에 상수를 두지 않고 config→`config.ts`→어댑터→app 계층으로 전달한다.
- TTL이 지난 스냅샷은 `available`로 승격하지 않고 `unknown`으로 남긴다(reason `stale_snapshot`).
- `limited`는 TTL이 아니라 `resetsAt`로만 유효한다. `resetsAt`이 지나면 `unknown`으로 되돌린다(차단 해제).
- 차단 규칙은 그대로다: `unknown`은 차단하지 않고 `limited`는 `resetsAt` 이전에만 차단한다.

## 미확인·후속
- claude·opencode·agy의 한도 이벤트는 로컬 transcript에서 확인하지 않았다. 각 CLI의 실제 한도 도달 로그 샘플이 필요하다.
- pane과 rollout 파일의 매핑 방법(cwd, 세션 id)은 설계 단계에서 확정한다.
- claude·opencode·agy 어댑터, 모델별 한도 키, 수동 확인 입력 UI는 미구현이다(#32 잔여).
