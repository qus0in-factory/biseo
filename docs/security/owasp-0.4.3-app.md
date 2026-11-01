# 0.4.3 영역 A 애플리케이션 보안

## Situation — 범위와 기준

- 2026-11-01, #45 최신 댓글의 영역 A: 인증·세션·PIN·refresh, 접근 제어, 큐·패널 관리 API, 입력·터미널 처리·로깅.
- 기준점: `origin/dev`의 `d6c55be`, 브랜치 `security/043-app`.
- 공식 최신판 확인: [OWASP Top 10:2025](https://owasp.org/Top10/2025/), [ASVS 5.0.0](https://owasp.org/www-project-application-security-verification-standard/) (공식 페이지의 최신 stable, 2025-05-30).
- ASVS 인증·세션·권한·입력 검증·로그 통제 관점의 코드 점검이며, 전체 ASVS 인증이나 침투 테스트 결과가 아니다. OS 명령 주입 기준은 v5.0.0-1.2.5를 참고했다.
- 영역 B(공급망·헤더·프런트 XSS·비밀 이력·CI)는 별도 담당 범위. 비밀 값 출력, 운영 공격성 요청, 배포·push·병합·재분배를 하지 않았다.

## Task — 위험도와 수용 조건

확인한 고위험은 없으며, 재현한 중위험 2건은 아래와 같이 수정했다. 위험도는 유효한 사용자 세션 또는 내부 서비스 인증이 필요한 단일 소유자 운영 모델을 고려한 정성 평가다. Cookie SameSite 기본 Lax는 일부 공격을 제한하지만, same-site의 다른 origin이나 설정 변경을 대신 보호하지 못한다.

| ID / 위험도 | 근거·영향 | 조치 | 잔여 위험 |
| --- | --- | --- | --- |
| A-01 / 중 / A01:2025 | 패널 생성·종료·이름 변경 및 workspace 선택에 Origin 검사 누락. 인증 쿠키가 동반되면 외부 origin·Origin 없는 요청이 upstream 호출 단계까지 진행 | 패널 관리 등록부에 기존 `checkCsrf` 공통 미들웨어, workspace 선택에 같은 가드. 거부 시 403/no-store | 명시적으로 허용한 origin은 신뢰해야 한다. 브라우저 외 클라이언트의 Origin 위조는 인증을 대체하지 못함 |
| A-02 / 중 / A01:2025 | `renamePaneCheck`가 조율자 패널 이름 변경을 허용. 이름 기반 종료 보호를 제거하거나 일반 패널에 보호 이름을 부여할 수 있음 | 기존 설정 기반 `isCoordinatorLabel`로 현재 이름과 새 이름 모두 거부. workspace 검사 이후 403 | 이름 기반 보호이므로 로컬 Herdr 직접 변경·설정 파일 권한은 별도 운영 신뢰 경계 |
| A-03 / 저 / A09:2025 | `logger.ts` redaction은 일부 1단계 속성 중심이며 임의 깊이·루트 비밀 필드를 포괄하지 않음 | 문서화. 현재 HTTP 로그는 method/path/status/requestId, CLI는 명령 종류·코드·시간만 기록. prompt/응답 본문은 기록하지 않음 | 신규 로그 호출 시 명시적 허용 필드 유지 필요. `err`의 임의 메시지에 비밀을 넣지 않아야 함 |
| A-04 / 저 / A02:2025 | `getPinConfig`가 비정상 수치 설정에 엄격한 safe integer 검사를 하지 않고 일부 TTL·호스트 정책은 코드 기본값에 의존 | 문서화. 외부 입력으로 변경 불가하며 보호된 운영 설정으로 관리 | 운영자가 극단적 설정을 주면 시도 제한·TTL 의도가 약화될 수 있음. 설정 검증 강화는 후속 |

## Action — 확인한 방어와 재현

- 인증: `session.ts` + `shared/domain/validate.ts`에서 서명, issuer/audience/purpose, exp/iat/TTL 검사. `requireOwner`가 소유자 subject 확인. 서버 `/herdr/*`는 `serviceAuth`로 별도 bearer 검증.
- PIN: trusted IP·HTTPS/허용 호스트·CF worker 경유 제한, PIN 시도 예약 및 전역 제한, password 기반 hash 사용. PIN 세션은 `requireStrong`을 통해 PIN/신뢰 IP 관리 권한에서 배제된다.
- refresh: `refresh-current.ts`의 만료·폐기·hash 검사, `refresh-rotate.ts`의 조건부 DB 갱신·재사용 폐기, PIN refresh의 trusted IP 재검사. refresh cookie는 Secure/HttpOnly/Strict. logout은 refresh 폐기와 쿠키 삭제를 수행한다.
- 잔여 세션 특성: access token은 stateless이므로 이미 탈취된 토큰을 logout으로 즉시 무효화하지 못하고 기존 만료까지 유효하다. 즉시 폐기가 필요한 위협 모델은 서버 측 access 세션 검증을 별도 설계해야 한다. 이번 수정에서 수명 정책을 바꾸지 않았다.
- 큐: submit의 workspace 검증, 취소의 owner/workspace 범위 조회, 조건부 lease·queue token 처리와 기존 회귀 테스트를 확인했다. 내부 queue target 조회는 서비스 인증을 전제로 하며, 서비스 키 탈취 시의 내부 topology 노출까지 해결한 것은 아니다.
- 패널: 서버에서 workspace·이름·template allowlist 및 busy/inflight/pending 종료 방어. rename의 조율자 보호 누락만 최소 수정했다.
- 입력·터미널: 메시지 필드/길이 검증 및 workspace 대조, Herdr 실행은 `execFile` 인자 배열이며 shell 문자열을 만들지 않는다. 사용자가 요청한 agent prompt 자체의 명령 수행 능력은 의도된 기능이며 sandbox로 간주하지 않는다. 프런트 터미널/마크다운 HTML 처리는 영역 B다.
- A-01 재현: `worker/tests/panes-csrf.test.ts`. 수정 전 403 대신 502(검증 없이 upstream 시도). 패널 수정 후 workspace 선택에서도 동일 실패를 먼저 확인했다. 최종 테스트는 fetch를 mock하여 외부 요청하지 않는다.
- A-02 재현: `src/ui/panes-rename-security.test.ts`. 수정 전 조율자→worker 변경에 403 대신 200. 수정 후 보호 제거·보호 이름 사칭 모두 403.
- 기존 정상 workspace 선택·권한 거부·패널 pending 보호 테스트에 정상 Origin을 추가해, CSRF 거부가 기존 검증을 가리지 않게 했다.

## Result — 검증과 한계

- `pnpm install` 완료. `pnpm test`: **819/819 통과**, 실패·취소·skip 0.
- `pnpm typecheck`, `pnpm build`, `git diff --check` 통과. 기존 Vite 500 kB chunk 경고만 존재.
- 재현 로그: `/tmp/sol-043-csrf-before.log`, `/tmp/sol-043-workspace-before.log`, `/tmp/sol-043-rename-before.log`.
- 최종 실행 근거: `/tmp/sol-043-test.log`, `/tmp/sol-043-typecheck.log`, `/tmp/sol-043-build.log`.
- 변경한 모든 TS 파일의 최대 크기는 27줄·1011자(전체 텍스트, 공백·줄바꿈 포함)로 128줄·1024자 이하이며 새 import 별칭·외부 Action을 추가하지 않았다.
- 작성자: sol (GPT-6.1 Sol). 재분배 금지에 따라 타 계열 리뷰는 수행하지 못했으며 **독립 리뷰 확인 불가**다. 자동 검증 통과를 타 계열 리뷰로 대체해 주장하지 않는다.
- 운영 로그인·인증 API·실제 큐 전달·브라우저·Funnel 직접 접근을 실행하지 않았다. 운영 환경 안전성 전체를 보증하지 않는다.
