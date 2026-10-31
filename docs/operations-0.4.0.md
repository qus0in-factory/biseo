---
audience: user
---
# 0.4.0 운영과 복구

## 기준과 기능

2026-10-31 릴리스 보고 기준 서버는 `biseo-release-040`의 0.4.0, Worker는 `1ef2df07-0aa7-455d-a537-69026126234d`다. 직전 Worker는 `a58b5206-b815-413c-a44e-005c930215ee`, 서버 복구 대상은 `biseo-release-0313`이다. 이는 당시 기록이지 현재 상태의 실시간 보증이 아니다. 이전 운영 문서는 해당 버전의 기록이며 이 절차보다 우선하지 않는다.

- 인증된 대시보드에서 Herdr workspace 선택 및 패널 열기·닫기·이름 변경을 지원한다. 작업 중인 패널, 예약과 조율자 보호를 확인한다 (#113, #136).
- D1 예약은 패널별 FIFO·lease·재시도로 복구한다. 전달 결과가 불확실한 경우 중복 가능성을 확인하며 정확히 한 번 전달을 보장한다고 단정하지 않는다 (#138).
- 신뢰 IP와 6자리 PIN, 세션 refresh 회전·재사용 탐지를 지원한다. PIN은 IP 단독 인증이 아니며 신뢰 IP 철회 후 PIN 갱신을 차단한다 (#118, #143).
- 패널 상태 집계, 사용량 경고(5h 90%, 주·월 98%, 미확인은 별도), 접힌 패널 수 1~3 조절, Argon 주간 사용량을 제공한다. 상단 알림과 OpenCode Free 사용량은 제거했다 (#137, #139–#142, #144).

## 설정과 D1

서버 기본값은 `config/runtime.json`, 패널 템플릿과 조율자 보호는 `config/pane-templates.json`, `config/coordinator-panels.json`, 화면 임계값은 `web/resources.json`을 확인한다. 서버의 workspace, callback, 서비스 토큰 issuer/audience 및 공개키 경로는 실제 환경에 맞춘다. Worker의 세션·PIN·refresh TTL, 허용 호스트·origin, cron 및 D1 바인딩은 `wrangler.jsonc`를 확인한다. 비밀번호·서명 개인키 등 비밀은 보호된 secret 경로에서 관리하고 문서나 로그에 남기지 않는다. 설정 파일의 기본값을 운영값으로 가정하지 않는다.

운영 마이그레이션 전 인증과 복구 방식을 확인하고, 권한을 제한한 비어 있지 않은 D1 백업을 확보한다. 적용 이력을 조회해 누락분만 순서대로 적용한다. 0.4.0 릴리스 보고에서는 0007–0011 적용 및 스키마 확인을 마쳤다.

| 번호 | 변경 |
|---|---|
| 0007 | 큐 대상 terminal 세대, lease와 FIFO 인덱스 |
| 0008 | 큐 재시도 횟수 |
| 0009 | 신뢰 IP, PIN 및 시도 제한 |
| 0010 | 사용량 기간 시작 시각 |
| 0011 | refresh 세션과 토큰 계열 |

## 서버 worktree 전환

1. 현재 PM2 `biseo`의 cwd·script·버전·재시작 횟수와 다른 앱을 확인하고 기존 worktree를 보존한다. D1의 queued/working 턴과 실제 활성 작업을 확인한다. D1 조회만으로 메모리 내 작업이 없다고 단정하지 않는다.
2. 새 worktree에 의존성 설치 및 빌드를 마치고 기존 운영 설정을 새 스키마와 비교해 안전하게 반영한다. **기존 worktree의 `config/service-public.key`를 새 worktree의 같은 경로로 복사**하고 경로·권한을 확인한다. 필요한 다른 운영 파일도 누락 여부를 점검하되 비밀을 출력하지 않는다. `pnpm preflight`를 실행하고 인증된 health 확인 수단을 전환 전에 확보한다.
3. `startOrRestart`로 worktree를 전환하지 않는다. 성공 메시지에도 기존 cwd/script가 남은 사례가 있다. 승인과 중단 계획을 확인한 뒤 `biseo`만 `pnpm exec pm2 delete biseo`로 삭제하고, 새 worktree에서 `pnpm exec pm2 start ecosystem.config.cjs --only biseo`로 시작한다. 다른 PM2 앱은 건드리지 않는다.
4. 최소 15초 뒤 online, 새 cwd와 `dist/server/src/index.js`, 예상 버전, 재시작 횟수 증가 없음과 오류 로그를 확인한다. 인증 health와 미인증 거부도 확인한다. 실패 시 즉시 아래 서버 복구를 실시한다. 모든 게이트 통과 후에만 `pnpm exec pm2 save`한다.
5. Worker 배포 전에 실제 현재 버전 ID를 기록한다. 배포 후 공개 루트와 미인증 API 응답을 확인한다. 릴리스 당시 루트 200, `/api/health` 401이 보고되었다.

## 롤백

- 서버: 활성 작업과 PM2 상태를 확인하고 `biseo`만 삭제한 뒤 보존된 직전 worktree의 ecosystem 파일로 시작한다. cwd·script·버전·15초 안정성·health 및 로그를 재확인하고 성공 시 저장한다. 릴리스 중 실제로 0.3.13으로 복구한 기록이 있다.
- Worker: 배포 직전에 기록한 이전 버전과 현재 CLI 사용법을 확인한 뒤 `pnpm exec wrangler rollback <이전-버전-ID>`를 사용하고 공개 응답을 검증한다. 위 ID는 0.4.0 당시의 기록일 뿐 이후 배포의 직전 버전이 아니다.
- D1: 애플리케이션 구버전과 현 스키마 호환성, 백업 이후의 쓰기와 데이터 손실을 먼저 평가한다. 백업을 무조건 덮어쓰지 않는다. 필요하면 쓰기 중지·복구 시점·복구 검증을 별도로 결정한다.
