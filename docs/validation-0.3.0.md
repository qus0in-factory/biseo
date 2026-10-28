# 0.3.0 구현·검증 기록

2026-10-28. 상태: 로컬 구현 및 격리 검증 완료, 실제 패널 메시지 왕복·운영 배포·사용자 만족 확인은 미완료. 커밋·push 미실행.

## 범위와 담당

- #20 ds-g: 기존 Herdr 패널 현황, CLI 전송, 구조화 transcript 응답 수집, 이벤트 구독·SSE. src/**.
- #21 ga: 기존 세션·서비스 PASETO를 재사용하는 REST/SSE, Origin·workspace 제한, no-store·세션만료 종료. worker/**.
- #22 gf: 최소 대시보드·단일 타임라인·불가 사유·처리 표시, SSE 수명/재접속/낙관적 응답. web/**.
- #23 sol: 공통 domain 타입·단일 workspace 설정·기본 테스트 명령(UI 포함)·통합 검증.
- D1 영속화/검색/과거 스크롤은 #24(0.3.1), 전체 UI 고도화는 #25(0.3.2). 현재 메모리 상태는 재시작/새 페이지에서 유실될 수 있다.

## 검증 결과

- Node 24.22.1 환경의 pnpm typecheck, pnpm build, pnpm test 통과(86 tests).
- UI 기본 테스트를 package.json test에 포함. source/worker/web/shared 229개 코드 모듈이 128줄·1024자 이하, git diff --check 통과.
- Wrangler 4.153.0 deploy --dry-run 번들 통과. 최신 stable 4.154.0 존재 확인, 앱 의존성 업그레이드는 추가하지 않음.
- 실제 Herdr 이벤트 구독 ack 및 backend SSE 초기 pane.updated에서 기존 10개 패널 확인. 읽기 전용이며 시험 메시지는 미전송.
- 격리 Chrome fixture: 패널 선택·POST·완료 SSE 선도착·단일 응답·렌더 중 SSE 연결 유지·삭제 패널 반영·비활성화 통과. XSS 문자열을 HTML로 실행하지 않고 text로 렌더링함을 확인. 모바일 화면 확인. 운영 인증/실제 에이전트 응답을 검증한 시험은 아님.
- UI mock 서버·브라우저·SSE·타이머는 finally로 종료. 도구 세션 종료와 OS 잔여를 따로 확인.
- PM2 운영 biseo는 online, Node 24.22.1, Herdr binary 경로 포함 확인. 새 코드로 재시작하지 않았으므로 운영 Herdr 통합 검증은 남음.

## 교차 리뷰·반영

ga가 서버를 리뷰: socket 이벤트 dot/underscore 정규화 수정. hyphen 텍스트 옵션 오인 지적은 설치 CLI에서 재현되지 않아 canonical 위치인자를 유지하고 불필요 fallback 제거.
sol 리뷰: prepare 실패 후 lock 누수 수정, SSE callback 변경에 따른 재연결 루프 수정, 스냅샷 계약 통일, offline 전송 차단, SSE 완료 후 늦은 POST 오류가 답변을 실패로 덮는 경합 수정.
마지막 경합은 Red→Green 확인, Sonnet 5.5 정적 리뷰 통과(리뷰어가 테스트 실행한 것은 아님).

## 지원 및 남은 게이트

Claude·Antigravity의 session metadata/구조화 JSONL 기반만 수집을 지원한다. OpenCode·Codex 등 metadata 미지원 패널은 sendable=false와 response_capture_unavailable로 표시한다. raw terminal snapshot/diff를 답변으로 대체하지 않는다.

자동 승인 검토가 기존 배정의 실제 패널 임의 시험 전송 금지 조건을 근거로 son 대상 시험 메시지 실행을 거부했다. 실제 메시지 왕복은 사용자 승인 후 지정한 시험 대상으로만 진행한다. 현재 시험용 son은 유휴 리뷰 워커이며, 제안 메시지는 도구 실행 없이 고정 한 줄 응답을 요청하는 내용이다.

ALLOWED_WORKSPACE_ID를 서버 runtime.json과 Worker vars에 일치시켰다. FUNNEL_BASE_URL 미설정 시 기존 Secret FUNNEL_HEALTH_URL의 HTTPS origin을 재사용한다. 새로운 키·비밀번호·D1은 생성하지 않았다.

## 1회 제로샷 실질의 후 보정

사용자가 단순 문의 검증을 허용한 뒤 유휴 son에 `1+1은 무엇인가요?`를 정확히 한 번 전송했다. POST는202, son 실제답은 `1+1은 **2**입니다.`였다. 최초 완료 SSE는 capture_unavailable로 끝났다. 실제 런타임 USER_INPUT이 USER_REQUEST/ADDITIONAL_METADATA envelope로 저장되어 원문 비교가 실패한 것이 원인이다.

원문 envelope를 한 겹 해제하고 질문 전체를 정확히 비교하도록 보정했다. 다른 질문 거부·중첩 태그 보존·plain 호환 테스트 Red→Green, 전체89개·타입·빌드 통과. 승인된 두 레코드만 재생해 실제답 회수를 확인했으며 추가 질문은 전송하지 않았다.

ds-g 타계열 리뷰 통과, gf의 미지원/오프라인/고정안내/UI 텍스트 표시 검증 통과. 수정 후 새 실질의의 전체 live SSE는 아직 재실행하지 않았으므로 기록 재생과 구분한다. ga의 인증된 Worker↔Backend 격리 재생 통합 검증을 이어간다. 운영 배포·커밋·push는 미실행이다.

## 최종 통합 재생 검증

ga가 Worker cookie→서비스 PASETO→실제 backend createApp 인증/turn→SSE 중계의 격리 통합 테스트를 추가했다. Herdr 전송은 stub으로 대체했고, 승인된 질의 두 레코드는 고정 가상 metadata를 가진 저장소 내부 fixture로 만들어 /tmp 의존성을 제거했다. 202 접수·completed 응답2·미인증/잘못된 서비스 키401·prompt stub1회·polling0회·socket/timer/fetch finally 정리를 확인했다.

root 최종 확인: Node24.22.1에서 타입 검사와 전체91개 테스트 통과. 사용자 설정 gf/ga/sol medium 표시 확인. effort 점검은 이슈 #19 댓글6470898989에 보고했다. 이 결과는 실제 Herdr 재전송이나 운영 배포 검증과 구분한다.
