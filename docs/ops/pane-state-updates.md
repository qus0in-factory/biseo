# 패널 상태 갱신과 표시 보완

## Why
- 사용자는 sol에 작업 중/차단됨이 계속 표시되어 전송할 수 없다고 보고했다. 직접 조회 시 sol은 이 조사를 수행하는 실제 working 상태였다. 사용자 화면의 차단됨과 같은 시점의 Herdr blocked 여부는 확인하지 못했다.
- 별개 결함을 재현했다. 마지막 Herdr 상태 이벤트가 서버 잠금 해제 전에 발생하면, 잠금 해제 자체는 이벤트를 만들지 않아 브라우저가 오래된 agent_busy 스냅샷을 유지할 수 있었다.

## What
- PaneLocks의 실제 reserve/release 변경을 구독하고 기존 SSE refresh로 pane.updated를 발행한다. 요청 ID가 다른 해제나 중복 reserve에는 알리지 않는다.
- 기존 120ms debounce와 workspace별 paneSnapshot을 유지한다. SSE 종료 시 잠금 구독도 해제한다. 실제 working/blocked 판정과 전송 차단은 유지한다.
- 폴링·강제 잠금 해제·자동 메시지 재전송은 추가하지 않는다.

## How
- 변경 전: release 이후 두 번째 pane.updated를 1.5초 안에 받는 회귀 테스트 실패。
- 변경 후: release 갱신·종료 시 해제·다중 클라이언트·workspace 범위·잠금 구독 회귀 5건 통과. son 타 계열 리뷰 통과, sol은 코드와 테스트 범위를 직접 대조했다.
- 이 테스트는 갱신 누락을 검증하며 사용자 개별 사례의 원인이나 물리 iPhone 렌더를 확정하지 않는다.

## 후속 가용성 정보
- ga는 사용량 한도에 도달했지만 Herdr 상태는 idle일 수 있다. 실행 상태와 제공자 가용성은 별도 정보다.
- 한도·재개 시각·확인 불가를 구분하는 계획은 [#32](https://github.com/qus0in-factory/biseo/issues/32)에 기록했다. 이번 보완에 한도 감지나 남은 사용량 추정은 포함하지 않는다.
