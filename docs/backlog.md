---
audience: user
---
# 0.1.0 백로그

## Why

사용자가 요청한 최소 health 목표만 릴리스에 포함한다. 인증과 추가 목표는 버전을 배정하지 않은 백로그다.

## What

| 순서 | 이슈 | 라벨 | 우선도 | 영향도 | 선행 |
| --- | --- | --- | --- | --- | --- |
| 1 | [#2 pnpm 기반 Hono /health 서버를 6543 포트에 추가](https://github.com/qus0in-factory/biseo/issues/2) | service | P1 | medium | 없음 |
| 2 | [#3 PM2로 health 서버 실행·재시작 관리](https://github.com/qus0in-factory/biseo/issues/3) | process | P2 | medium | #2 |
| 3 | [#4 Tailscale Funnel 443을 로컬 6543에 연결](https://github.com/qus0in-factory/biseo/issues/4) | exposure | P1 | high | #3 |
| 4 | [#5 브라우저 또는 REST에서 외부 /health HTTP 200 확인](https://github.com/qus0in-factory/biseo/issues/5) | validation | P1 | medium | #4 |

평면 라벨은 tracking·service·process·exposure·validation이며 이슈당 정확히 하나다. tracking은 부모 #1 전용이다. 우선도·영향도는 라벨 대신 본문 필드로 둔다.

마일스톤은 [0.1.0](https://github.com/qus0in-factory/biseo/milestone/1) 하나다. 선행 의존성을 우선하고, 동시에 가능한 작업에서 우선도와 영향도를 비교한다.

## How

- 서버 → PM2 → Funnel → 외부 200 확인 순으로 구현·검증했다. 결과는 [실행 기록](operations.md)을 따른다.
- 모든 변경은 dev에 통합하고 dev → main PR로 승격한다. 이슈는 실제 검증을 기록한 뒤 main PR merge로 닫는다.
- 인증·JWT/PASETO·워커 SDK·상세 운영 기준·다음 버전은 사용자의 구체적 요청 전에는 구현·마일스톤에 넣지 않는다.
- 이전 backlog-*-review 및 상세 인증 문서는 범위 축소 전 검토 기록으로 보존한다. 최종 결정은 이 문서와 원격 이슈다.

## 0.5.2 이후 백로그

0.5.2 릴리스 뒤 남은 항목이다. 버전과 마일스톤은 배정하지 않는다.

| 항목 | 내용 | 선행·결정 |
| --- | --- | --- |
| 사용량 이력 서버 API·D1 유지 여부 | 제공자별 사용량 이력 조회 API와 화면을 다시 도입할지 결정한다. 0.5.2에서 `사용량 자세히 보기` 진입점과 관련 화면을 제거했고, 현재는 최신 스냅샷만 표시한다. | D1 `usage_snapshots` 유지 여부 결정 대기 |
| 워크스페이스 목록 구분선 무게 | 워크스페이스 전환 탭·목록의 구분선이 다른 플랫 표면보다 무겁게 보이는지 검토하고 토큰으로 조정한다. | 디자인 검토 |
| 375 입력창 안내 아이콘 줄 | 375px에서 입력창의 안내 아이콘과 상태 문구가 어색하게 줄바꿈되는 문제를 재현하고 배치를 정리한다. | 재현 캡처 후 |
