> 범위 축소 전 검토 기록이다. 인증과 0.2.0은 현재 계획에서 제외한다. 최신 목표는 Hono·pnpm·PM2, 6543 → Funnel 443의 무인증 /health HTTP 200이며 backlog.md를 따른다.

# Biseo 백로그 검증·이슈 분해 검토

작성: ds-o · 2026-10-28 · 25 AC → 3개 결과물
검토: healthcheck-acceptance.md, funnel-auth-plan.md, exposure-review.md, backlog-auth-review.md, backlog-operations-review.md, backlog-plan.json, planning-coordination.md, development.md
비수행: GitHub 쓰기, 구현·실행, Funnel/서비스 활성화, 커밋·푸시, 다른 파일 수정

## 검토 결론

- 25 AC를 1:1 복제하거나 인증 영역을 8개 micro-issue로 쪼개지 않는다. 독립 완료·검증 가능한 결과물 3개로 묶는다.
- 라벨은 Sol 통합안과 같은 평면 영역 `authentication`/`validation` 중 하나만 붙이고, 워커 이름은 별도 `담당` 필드로 둔다. `glm-z` 운영과 `gf` 라벨·릴리스는 별도 파일/단계다.
- 배열: A(P0/High) → B(P0/High) → C(P1/Medium). `0.1.0`은 health+TLS+API key, `0.2.0`은 후속 호출 클라이언트다.
- B의 외부 공개 전 A(로컬 인증·fail-closed·시크릿 비노출) 완료가 필수다.
- JWT/PASETO, 새 API route, `0.1.1`은 이 백로그에서 만들지 않는다.

## 이슈안

### A. 로컬 health 인증·fail-closed·시크릿 비노출 게이트
- 라벨: `authentication` | 담당: `opus` | 우선도: P0 | 영향도: High | 추천 릴리스: `0.1.0`
- 선행: API key 저장·주입·scope·rate limit 값 결정(Opus). 외부 의존 없음.
- 수용: loopback health는 유효 `health:read` 키에 200 `{"status":"ok"}`·`application/json`·본문 상한 설정값(제안 ≤512B), 누락/무효/폐기 401, scope 부족 403, 미등록 경로 404; `/api/*` 미노출. health는 liveness로 정의하고 readiness를 선택할 때만 준비 안 됨 503을 사용하며 유한 타임아웃을 둔다. 설정 누락·빈 목록·파싱 실패·재로딩 실패 시 기동 거부 또는 마지막 유효 설정 유지(fail-closed, 무인증 전환 금지).
- 수용(계속): rate limit 초과는 429·일반화 오류·5xx 없음, 잘못된/누락 키 반복은 유한 처리·키 열거 없음, 제한 키는 관측 가능한 신원 또는 검증된 프록시를 사용(신뢰할 수 없는 IP 단독 금지). 키 원문은 응답·URL·로그·증적·저장소에 없고 `key_id`만. 자동화 테스트로 재현.
- 제외: 외부 443/TLS, Funnel, `/api/*` 서버 구현, JWT/PASETO, 공개 health.
- 추적: AC-04~15, 23 (1차 health 범위)

### B. Funnel 외부 HTTPS 443 health 수용 검증
- 라벨: `validation` | 담당: `sol` | 우선도: P0 | 영향도: High | 추천 릴리스: `0.1.0`
- 선행: A 완료, glm-z의 `backlog-operations-review.md` 사전점검·중지/복구 런북(현 ops 제안 0.2.0 → 0.1.0 게이트로 조정 필요), 기존 443 소유 확인, 승인된 공개 윈도우.
- 수용(TLS·노출): 외부 회선에서 443/TLS 인증서 체인·만료·호스트명·검증 활성·설정된 최소 버전; 의도한 443 마운트만(8443/10000·파일/정적 마운트 없음), 백엔드 loopback.
- 수용(인증·장애): 무인증 401·유효 최소권한 키 200·권한 부족 403의 외부 회귀; 백엔드 중지 시 5xx에 내부 스택·주소·비밀 없음, Funnel 설정 유지; 재시작 후 설정값(제안 ≤30초) 내 200·반복 5xx 없음; DNS 전파 대기 상한과 DNS 실패/인증 실패 구분.
- 수용(운영 증적): 호스트/tailscaled 재시작 시 `--bg` 자동 재개·포그라운드 RTO 문서화; off/복구 증적에서 다른 서비스 보존, status와 실제 요청 모두 확인, status JSON을 복원 백업으로 오인하지 않음; 5xx 매핑 실측·증적 마스킹.
- 범위: B는 외부 요청과 증적 검증만 한다. Funnel 변경·중지·복구 실행은 glm-z의 런북/승인 단계 소관이다.
- 제외: 앱 인증 구현, 새 API route, 클라이언트 재시도, JWT/PASETO, 공개 health, `reset` 일상 사용.
- 추적: AC-01~03, 16~18, 24~25

### C. 후속 워커 호출 클라이언트 검증
- 라벨: `validation` | 담당: `sol` | 우선도: P1 | 영향도: Medium | 추천 릴리스: `0.2.0`
- 선행: A 인증 계약, `0.1.0` health 계약 동결, 호출 API 계약(스텁). B 실제 공개와 독립.
- 수용: 로컬 스텁으로 시도별/전체 타임아웃, 최대 재시도·백오프·지터, 4xx 비재시도, 429 `Retry-After` 경계, 취소 시 정리, 자격증명 비로그; 변경 요청은 계약에 멱등성 키가 있을 때만 재시도.
- 제외: `/api/*` 서버 구현·route 권한, 새 인증 방식, JWT/PASETO, 운영 배포·실트래픽.
- 추적: AC-19~22

## 검증 경계와 판정

- AC 커버리지: A=04~15,23 / B=01~03,16~18,24~25 / C=19~22. 25개를 복제하지 않고 전부 한 이슈에만 매핑했다.
- 검증 환경은 A=로컬, B=외부 회선, C=로컬 스텁으로 분리해 중복 판정을 피한다.
- B의 401/403은 A 소유의 외부 회귀 확인이며, 별도 인증 구현이 아니다. P2 `/api/*` 서버 route·API rate limit 부분(AC-07~15 중 P2)은 이 묶음 밖이며 후속 API 계약 이슈로 보류한다.
- 기존 인증 8개 초안은 A의 하위 실행으로 흡수하고, 통합 백로그의 세분화는 A/B/C 하위 작업으로 흡수한다. 25 AC 1:1 복제는 하지 않는다. 키 회전·route 권한은 C와 별도로 후속 API 계약에서 다룬다.
- 기존 계획 이슈 #1은 계획 기록으로 유지한다. A/B/C는 부모-자식이 아닌 평면 이슈이며, 게시는 sol, 라벨·마일스톤·릴리스 노트 적용은 gf가 맡는다.
- `glm-z` 운영 점검·원복은 `backlog-operations-review.md`의 별도 산출물을 선행 의존으로만 참조한다. `funnel-issue-plan.md`, `backlog-auth-review.md`, `backlog-operations-review.md`, `backlog-plan.json`은 수정하지 않았다.
- glm-z ops의 0.2.0 제안과 B의 0.1.0 게이트는 충돌한다. 공개 전 0.1.0으로 조정하는 것을 권고하며, 조정 전에는 B를 0.1.0으로 게시하지 않는다.
- 현재 `development.md`의 0.1.0 무인증 `/health` 목표는 이 검토의 API key 전제와 충돌한다. 이 문서는 사용자 요구(1차 health+TLS+API key)를 기준으로 했으며, 무인증으로 확정되면 A/B/C를 재작성해야 한다.
- 실제 GitHub 쓰기·코드 실행·Funnel/서비스 활성화·커밋/푸시·테스트는 수행하지 않았다. P0/P1, 수용 한도, 마일스톤은 검토안이며 게시 전 gf/sol 확인이 필요하다.
