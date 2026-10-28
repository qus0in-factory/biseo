> 이 문서는 이전 상세 설계·검토 기록이다. 최신 0.1.0은 Hono + pnpm + PM2, 로컬 6543 → Funnel 443의 무인증 /health HTTP 200만 목표로 한다. 인증과 상세 운영 조건은 다음 단계로 보류하며 현재 출시에 적용하지 않는다. 최신 범위는 funnel-issue-plan.md와 backlog.md를 따른다.

# Biseo Funnel Healthcheck·Worker API 수용 조건

작성: ds-o · 상태: 구현 전 계획 · 검증 상태: 실제 구현·배포·Funnel 실행 없음
대상: P1 health-only, P2 후속 워커 API
관련 문서: `funnel-auth-plan.md`(Opus, 인증 방식·키 수명주기), 통합 검증(Sol)

## Why

- Funnel은 biseo를 **인터넷에 공개**한다. Tailnet ACL이나 사설 네트워크 경계는 외부 요청을 막지 않는다.
- Funnel이 제공하는 TLS는 전송 구간 암호화와 서버 신원 확인일 뿐, **호출자 인증이 아니다**. 유효한 인증서만으로 health나 보호 API가 열리면 안 된다.
- 현재 구현 대상은 워커별 opaque API key이며, JWT/PASETO는 재평가 후보일 뿐이다. 방식이 바뀌어도 유지되는 외부 계약과 실패 동작을 먼저 고정한다.

## What

### 단계와 범위

- **P1 (health-only, 1차)**: 외부 HTTPS 443/TLS, `GET ${HEALTH_PATH}`의 API key + `health:read` 인증, 최소 health 응답, health rate limit, 백엔드 중지·재시작, Funnel 유지.
- **P2 (후속 워커 API)**: `/api/*` 인증과 route별 권한, API rate limit, 워커 클라이언트 타임아웃·재시도, 변경 요청 멱등성. P2 구현·검증 전에는 `/api/*`를 Funnel에 노출하지 않는다.
- JWT/PASETO는 현재 구현 대상이 아닌 재평가 후보이며, P1/P2 수용 조건에 포함하지 않는다.

포함: P1의 외부 443/TLS·health 인증·최소 응답·rate limit·백엔드 수명주기, P2의 워커 API 인증·인가·클라이언트 경계.

제외: API key의 발급·회전 구현 세부(Opus), P2 API 명세, JWT/PASETO 구현.

| 항목 | 문서에서 쓰는 표기 | 상태 |
|---|---|---|
| Funnel 호스트 | `${FUNNEL_HOST}` | 환경별 주입, 하드코딩 금지 |
| Health 경로 | `${HEALTH_PATH}` (Opus 제안: `/health`) | P1, API key + `health:read` 필수 |
| 보호 API 경로 | `${PROTECTED_PATH}` (Opus 제안: `/api/*`) | P2, API key + route별 권한 |
| 인증 헤더 | `${AUTH_HEADER_NAME}`, `${AUTH_HEADER_VALUE}` | 현재 API key 기준, Opus 제안 `Authorization: Bearer <key>` |
| 인증 방식 | 워커별 opaque API key | 현재 구현 대상. JWT/PASETO는 재평가 후보 |
| 지연·재시도 한도 | 각 AC의 "제안" 값 | 설정값, 합의로 확정 |

**보안 불변식**

1. TLS와 인증은 별개다. health와 보호 API 모두 TLS만으로 접근할 수 없다.
2. Funnel은 공개 인터넷이다. health도 기본 보호하며, 공개 전환은 별도 승인 전 제공하지 않는다. 노출 필드는 최소화하고 비밀·내부 주소·스택 트레이스·버전 정보를 응답에 넣지 않는다.
3. 백엔드는 loopback에만 바인딩한다. 공식 문서상 Funnel 역방향 프록시 대상은 `http://127.0.0.1`만 지원된다.
4. 자격증명은 환경변수/시크릿 저장소로 주입하고 URL·저장소·로그·검증 증적에 남기지 않는다.
5. 현재 구현 대상은 API key 하나다. JWT/PASETO는 재평가 후보이며, 이 문서는 해당 구현을 요구하지 않는다.

### 확정 조건과 제안값

**확정 조건(통합 초기안 기준)**

- `GET /health`(P1)는 API key + `health:read`, `/api/*`(P2)는 API key + route별 권한이 필수다.
- 누락·무효·폐기 자격증명은 401, 권한 부족은 403, rate limit 초과는 429, 백엔드 장애는 5xx다.
- Funnel 443, 백엔드 loopback, 응답·로그에 비밀 없음.
- P1은 health-only이며, P2는 후속 워커 API 범위다.

**제안값(구현 시 설정값으로 확정)**

- health 본문 상한: ≤512 bytes
- TLS 최소 버전: 1.2 이상
- 백엔드 중지 시 응답: ≤5초
- 재시작 후 health 복구: ≤30초
- 클라이언트: 시도 5초, 전체 30초, 최대 3회
- rate limit 임계값·창: 설정값

제안값은 통과 기준의 초안일 뿐이며, 확정 조건과 동일하게 취급하지 않는다.

### 수용 조건 (Given/When/Then)

우선순위: **Must** = 출시 전 통과, **Should** = 통과 또는 문서화된 위험 수용, **Conditional** = 결정된 경우에만 적용. **P1**은 health-only 1차, **P2**는 후속 워커 API이며, P1/P2 태그가 붙은 AC는 해당 단계에서만 요구한다.

#### A. 외부 HTTPS 443 (P1)

**AC-01 [P1][Must] 외부 도달과 인증서**
- Given Funnel이 `--https=443`으로 설정되고 백엔드가 loopback에서 실행 중이며, 유효한 최소권한 테스트 API key(`health:read`만 보유)가 준비되어 있다.
- When tailnet 외부 네트워크에서 인증 헤더와 함께 `https://${FUNNEL_HOST}${HEALTH_PATH}`에 요청한다.
- Then 유효한 공인 인증서로 TLS handshake가 성공하고 HTTP 200을 받는다. 인증서 만료·호스트명 불일치·신뢰 실패가 없어야 한다.

**AC-02 [P1][Must] TLS 검증**
- Given 외부 443에 연결한다.
- When TLS 협상과 인증서 체인을 검사한다.
- Then 서버 인증서 체인 신뢰, `${FUNNEL_HOST}` 일치, 만료 전, 설정된 최소 TLS 버전(제안 1.2) 이상이며, 검증을 끈 상태에서만 성공하는 구성이 아니다.

**AC-03 [P1][Must] 노출 최소화**
- Given `tailscale funnel status --json`과 호스트 리스닝 정보를 확인한다.
- When Funnel 마운트와 백엔드 바인딩을 검사한다.
- Then 의도한 443 경로만 노출되고, 8443/10000의 불필요한 마운트·파일 서버·정적 텍스트 마운트가 없으며, 백엔드는 loopback 외 인터페이스에 열려 있지 않다.

#### B. Health (P1)

**AC-04 [P1][Must] 최소 health 응답**
- Given 서비스가 요청을 처리할 수 있는 상태이고, 유효한 최소권한 테스트 API key(`health:read`만 보유)가 있다.
- When 인증 헤더와 함께 `GET ${HEALTH_PATH}`를 호출한다.
- Then 200, `application/json`, Opus 제안 본문 `{"status":"ok"}`(추가 내부 정보 없음)이며, 본문 상한은 설정값(제안 ≤512 bytes)이다. 비밀·의존성 상세·내부 호스트명·빌드 해시·스택 트레이스가 없어야 한다.

**AC-05 [P1][Must] health 의미와 일치한 응답**
- Given health를 liveness로 볼지 readiness로 볼지 문서화했고, 의존성 상세는 `/api/*` 아래 보호 경로로 분리하기로 했다.
- When 프로세스는 살아 있지만 요청 처리 준비가 되지 않았다(시작 중·드레이닝·필수 의존성 장애).
- Then liveness 기준이면 200, readiness 기준이면 503이며, 어느 경우든 의존성 상세는 health 응답에 넣지 않는다. health 자체가 매달리지 않도록 검사는 유한한 타임아웃을 가진다.

**AC-06 [P1][Must] health 기본 보호**
- Given `/health`의 기본 정책은 인증 필수이며, 공개 전환은 별도 승인 없이는 하지 않는다.
- When 자격증명 없이 `GET ${HEALTH_PATH}`를 호출한다.
- Then 401이며 health 정보·인증 단서를 노출하지 않는다. 공개 health는 별도 승인·문서화 전에는 제공하지 않으며, 승인 시 본 AC와 검증 계획을 갱신한다.

#### C. 인증·인가 (P1 health / P2 API)

**AC-07 [P1/P2][Must] 올바른 인증**
- Given 대상 범위(P1 health 또는 P2 route)에 필요한 최소 권한을 가진 유효한 테스트 API key가 있다.
- When P1은 `${HEALTH_PATH}`, P2는 `${PROTECTED_PATH}`에 인증 헤더와 함께 정상 요청한다.
- Then P1은 200, P2는 기대한 2xx를 받고, 응답·로그 어디에도 자격증명 원문이 반사되지 않는다.

**AC-08 [P1/P2][Must] 누락**
- Given 자격증명 헤더가 없다.
- When health(P1) 또는 보호 API(P2)를 호출한다.
- Then 401이며 health/API 데이터·내부 오류·자격증명 존재 여부를 노출하지 않는다.

**AC-09 [P1/P2][Must] 잘못된·변조된 인증**
- Given 형식 오류, 존재하지 않거나 변조된 자격증명이다(향후 토큰 후보는 서명 불일치 포함).
- When health(P1) 또는 보호 API(P2)를 호출한다.
- Then 401이며, "키 없음"과 "키 폐기"를 구분해 알려주지 않는다(열거 방지). 오류 본문은 일반화되어 있다.

**AC-10 [P1][Must] 폐기된 API key**
- Given 유효한 테스트 API key를 폐기했다.
- When 같은 키로 health(P1)를 호출한다.
- Then 다음 요청부터 401이다(현재 API key는 상태 기반이므로 즉시 폐기).
- P2 수용 시에는 같은 키로 `/api/*`도 401임을 확인한다. JWT/PASETO 재평가 시에는 폐기 정책을 TTL 만료 대기 또는 즉시 denylist 중 하나로 먼저 정하고, 그 정책의 경계(다음 요청 또는 TTL 이내)로 시험한다.

**AC-11 [P1/P2][Must] 권한 부족**
- Given 인증은 유효하지만 P1은 `health:read`가 없고, P2는 대상 route에 필요한 권한이 없다.
- When health(P1) 또는 보호 API(P2)를 호출한다.
- Then 403이며 데이터 변경·부분 실행이 없고, 응답에 권한 구조나 다른 사용자 정보가 없다.

**AC-12 [P1/P2][Must] 자격증명 전달 경로**
- Given 정상·오류 요청을 모두 수행한다.
- When URL, 프록시 로그, 애플리케이션 로그, 오류 응답을 검사한다.
- Then 자격증명이 쿼리 문자열이나 URL에 없고, 로그에는 `key_id`/지문 등 비밀이 아닌 값만 남는다.

#### D. Rate limit (P1 health / P2 API)

**AC-13 [P1/P2][Must] 초과 시 명시적 거부**
- Given health(P1)와 이후 `/api/*`(P2)의 rate limit 임계값이 설정되어 있다(코드 하드코딩 아님).
- When 유효한 키로 한도 내 요청은 정상, 한도를 넘는 버스트를 보낸다.
- Then 초과분은 429이고 5xx로 붕괴하지 않으며, 일반화된 오류 본문을 반환한다. `Retry-After`를 제공하면 클라이언트는 그 값을 존중한다.

**AC-14 [P1/P2][Should] 우회·고갈 방지**
- Given 잘못된 자격증명 또는 자격증명 없는 반복 요청이다.
- When 제한된 시간 동안 반복한다.
- Then 요청 처리량이 상한 내로 유지되고, 인증 우회나 자격증명 열거가 발생하지 않는다. 제한 키(자격증명/출처 IP 등)는 현재 API key와 프록시 신뢰 구성에 따라 문서화한다.

**AC-15 [P1/P2][Conditional] 한도 기준**
- Given rate limit 키와 창(window)을 결정한다.
- When 외부 출처 IP가 Funnel 뒤에서 보이지 않거나 신뢰할 수 없다면, IP 기반 제한을 전제로 하지 않는다.
- Then 실제 관측 가능한 값(자격증명 식별자 등)으로 제한하거나, 신뢰 프록시 구성을 검증한 뒤에만 IP를 사용한다.

#### E. 백엔드 중지·재시작 (P1)

**AC-16 [P1][Must] 중지 시 빠른 실패**
- Given 백엔드 프로세스를 중지했다.
- When 외부에서 유효한 `health:read` 키로 health를 호출한다.
- Then 5xx(502/503/504 계열)로 유한 시간(제안 ≤5초) 안에 실패하고, 내부 스택·주소·비밀이 노출되지 않는다. Funnel 설정 자체는 유지된다.

**AC-17 [P1][Must] 재시작 후 복구**
- Given 백엔드를 재시작했다.
- When 유효한 `health:read` 키로 health를 폴링한다.
- Then Funnel 재설정 없이 제안 ≤30초 안에 200으로 복구되고, 복구 후 이전 5xx가 반복되지 않는다.

**AC-18 [P1][Should] Funnel/호스트 재시작**
- Given Funnel을 `--bg`로 운영할지 포그라운드로 운영할지 결정한다.
- When 호스트 또는 tailscaled를 재시작한다.
- Then `--bg`면 공식 문서대로 Funnel이 자동 재개되고, 포그라운드면 수동 재시작 절차와 RTO가 런북에 명시된다. 어느 쪽이든 유효한 키로 health 복구를 확인한다.

#### F. 워커 클라이언트 타임아웃·재시도 (P2)

P2 후속 범위이며 P1 health-only 수용을 막지 않는다.

**AC-19 [P2][Must] 유한 타임아웃**
- Given 서버가 지연되거나 응답하지 않는다.
- When 워커가 호출한다.
- Then 시도별 타임아웃과 전체 데드라인(제안: 시도 5초, 전체 30초) 안에 중단되고, 취소 시 연결·백오프·큐가 정리된다.

**AC-20 [P2][Must] 재시도 경계**
- Given 네트워크 오류·타임아웃·5xx·429가 발생한다.
- When 재시도한다.
- Then 최대 시도 횟수(제안 3회), 지수 백오프+지터, 전체 데드라인을 지키며 타이트 루프를 만들지 않는다. 429는 `Retry-After`가 데드라인 안일 때만 재시도한다.

**AC-21 [P2][Must] 재시도 금지 대상**
- Given 400/401/403/404 등 클라이언트 오류다.
- When 워커가 응답을 받는다.
- Then 재시도하지 않고 타입이 있는 오류로 즉시 표면화한다. 인증 실패는 로그에 자격증명 없이 기록한다.

**AC-22 [P2][Conditional] 변경 요청 재시도**
- Given 향후 상태 변경(POST/PATCH/DELETE) API를 재시도한다.
- When 멱등성 키 또는 동등한 중복 방지가 없다.
- Then 자동 재시도를 켜지 않는다. 멱등성 키가 도입된 경우에만 재시도를 허용한다.

#### G. 노출 운영 경계 (통합 검토 반영)

**AC-23 [P1][Must] 인증 설정 누락 시 비공개**
- Given 키 해시·권한 설정이 없거나 비어 있거나 파싱할 수 없다.
- When 앱을 시작하거나 설정을 갱신한다.
- Then 무인증 서비스로 전환하지 않고 기동을 거부하거나 마지막 유효 설정을 안전하게 유지한다. 유효한 인증 설정 확인 전에는 Funnel을 공개하지 않는다.

**AC-24 [P1][Must] 기존 설정과 DNS 준비**
- Given Serve와 Funnel의 기존 443 구성을 조회했다.
- When 다른 서비스 설정이 있거나 외부 DNS가 준비되지 않았다.
- Then 기존 서비스는 소유 범위 확인·허용 전 덮어쓰지 않으며, DNS 전파 대기 상한을 정하고 DNS 실패를 앱 인증 실패와 구분한다.

**AC-25 [P1][Must] 대상 중지와 기존 구성 복구**
- Given 실제 공개 명령의 포트·마운트 플래그와 기존 구성을 비밀 없이 기록했다.
- When 같은 대상 플래그로 off하고 필요한 기존 설정을 명시적으로 다시 적용한다.
- Then 해당 공개가 중지되고 다른 서비스는 유지되며 기존 구성이 status와 실제 요청으로 복구되었음을 확인한다. status JSON은 자동복원 백업으로 취급하지 않는다.

### 인증 방식 범위와 재평가 후보

현재 구현 대상은 **워커별 opaque API key** 하나다. `GET /health`는 `health:read`, `/api/*`는 route별 권한을 요구한다. JWT/PASETO는 현재 구현·수용 대상이 아니며, 아래 표의 해당 행은 **재평가 시에만** 적용한다.

| 방식 | 현재 범위 | 재평가 시 확인할 조건 |
|---|---|---|
| API key (현재) | P1/P2 | 유효 키 2xx, 누락/변조/폐기 401, 권한 부족 403, 폐기 즉시(다음 요청부터), 회전 시 이전 키 거부·새 키 정상, 로그에 `key_id`만 기록 |
| JWT (재평가 후보) | 제외 | 서명·alg 허용목록·iss·aud·exp 검증, `nbf` claim이 **있는 경우** 현재 시각 이전이면 401(없으면 통과), 폐기 정책은 TTL 만료 대기 또는 즉시 denylist 중 선택해 그 경계로 시험 |
| PASETO (재평가 후보) | 제외 | `local`/`public` purpose를 용도에 맞게 고정(local은 공유 대칭키 기반 인증 암호화, public은 비대칭 서명·공개키 검증), version/purpose 불일치·만료 401, 폐기 정책은 TTL 만료 대기 또는 즉시 denylist로 구분 |

공통: AC-07~AC-12의 401/403 의미는 방식과 무관하게 유지한다. 현재 테스트는 API key만 사용하며, JWT/PASETO의 키 생성·검증 구현은 범위 밖이다. 헤더 이름·형식·오류 스키마는 Opus 문서에서 확정하며, 검증용 인증 헤더는 보호된 `${AUTH_CURL_CONFIG}` 파일에서 읽는다.

### 미정 사항과 결정 위치

| 미정 항목 | 결정·기록 위치 |
|---|---|
| API key 세부(헤더 형식, 키 수명주기, 저장) | `funnel-auth-plan.md` (Opus) |
| health 공개 전환(별도 승인), 정확한 경로·응답 스키마 | 구현 PR + 본 문서 갱신 |
| P2 route별 권한 매트릭스 | Opus + API 명세 |
| JWT/PASETO 재평가 조건 | Opus |
| rate limit 임계값·키·창 | 설정 문서 + 본 문서의 검증 결과 |
| Funnel의 정확한 5xx 매핑, 출처 IP 가시성 | 구현 단계 실측 후 본 문서에 기록 |
| 재시도·타임아웃 기본값 | 설정값으로 확정, 본 문서의 제안값 대체 |

## How

### 검증 전제

- 이 문서는 계획이며, 작성자는 실제 구현·배포·Funnel 실행·외부 테스트를 수행하지 않았다. 구현과 실행 환경이 준비된 뒤 검증한다.
- P1 health-only를 먼저 검증하고, P2는 P1 이후 별도로 검증한다. P2 미완료는 P1 수용을 막지 않는다.
- P1 정상 health 요청은 유효한 최소권한 테스트 API key(`health:read`)를 사용하고, 무인증 요청은 401 확인에만 사용한다.
- 외부 네트워크 관점(모바일 회선 등)과 내부 운영 관점을 분리해 측정한다.
- 테스트 자격증명은 시크릿 저장소에서 주입하고, 폐기·회전 테스트는 **테스트 키만** 사용한다.
- 운영 트래픽 영향이 있는 rate limit·중지 테스트는 스테이징 또는 합의된 짧은 윈도우에서 수행한다.
- 증적에는 상태 코드, 지연, 설정 스냅샷, 마스킹된 로그만 남기고 자격증명·쿠키·내부 주소는 남기지 않는다.

### 검증 매트릭스

| 단계 | 대상 | 방법 | 통과 증적 |
|---|---|---|---|
| P1 | 외부 443/TLS | 외부 단말에서 시간 제한을 둔 `curl`, `openssl s_client -verify_hostname -verify_return_error` | HTTP 코드, TLS 버전, 인증서 체인·호스트명, 지연 |
| P1 | Funnel 노출 | `tailscale funnel status --json`, 리스닝 포트 확인 | 의도한 443 마운트만 존재, 백엔드 loopback |
| P1 | Health | 유효 키 200, 무인증 401, `health:read` 없는 키 403, 본문 크기·내용 측정 | 상태 코드, Content-Type, 본문 필드, p95 |
| P1 | Rate limit | health 임계값에서 제한된 버스트, 창 경과 후 재시도 | 429 발생, 5xx 없음, 창 후 정상 |
| P1 | 백엔드 중지 | 프로세스 중지 후 외부 health 호출, Funnel status 확인 | 5xx, 응답 시간 상한, 설정 유지 |
| P1 | 백엔드 재시작 | 재시작 후 유효 키로 health 폴링 | 복구 시간, 이후 연속 200 |
| P1 | Funnel 재시작 | 합의된 윈도우에서 `--bg`/포그라운드 각각 확인 | 자동 재개 여부, 수동 절차, RTO |
| P2 | API 인증·인가 | 정상/누락/변조/폐기/저권한 키로 `/api/*` 호출 | 2xx/401/401/401/403, 비밀 미노출 |
| P2 | API rate limit | route별 임계값에서 버스트, 창 경과 후 재시도 | 429, 5xx 없음, 창 후 정상 |
| P2 | 클라이언트 경계 | 지연·5xx·401·429 스텁 서버로 단위/통합 테스트 | 시도 횟수, 백오프 간격, 전체 경과, 취소 |

예시(구현 단계에서 환경변수로 실행, 값은 저장소에 커밋하지 않음):

`AUTH_CURL_CONFIG`는 저장소 밖의 보호된 curl 설정 파일 경로다. 키는 설정 파일에서 읽고 프로세스 인수·셸 추적에 노출하지 않는다. 인증 설정 누락 시 서비스가 시작 또는 공개되지 않는지도 검증한다.

```sh
: "${CURL_CONNECT_TIMEOUT:?set from config}"
: "${CURL_MAX_TIME:?set from config}"
: "${AUTH_CURL_CONFIG:?set protected config path}"

# P1: 인증된 health (200 기대)
curl -sS --connect-timeout "${CURL_CONNECT_TIMEOUT}" --max-time "${CURL_MAX_TIME}" \
  -o /dev/null -w '%{http_code} %{time_total}\n' \
  --config "${AUTH_CURL_CONFIG}" \
  "https://${FUNNEL_HOST}${HEALTH_PATH}"

# P1: 무인증 health (401 기대)
curl -sS --connect-timeout "${CURL_CONNECT_TIMEOUT}" --max-time "${CURL_MAX_TIME}" \
  -o /dev/null -w '%{http_code} %{time_total}\n' \
  "https://${FUNNEL_HOST}${HEALTH_PATH}"

# TLS: 체인과 호스트명을 함께 검증
openssl s_client -connect "${FUNNEL_HOST}:443" \
  -servername "${FUNNEL_HOST}" \
  -verify_hostname "${FUNNEL_HOST}" \
  -verify_return_error </dev/null

# P2: route 인증 (2xx 기대)
curl -sS --connect-timeout "${CURL_CONNECT_TIMEOUT}" --max-time "${CURL_MAX_TIME}" \
  -o /dev/null -w '%{http_code}\n' \
  --config "${AUTH_CURL_CONFIG}" \
  "https://${FUNNEL_HOST}${PROTECTED_PATH}"
```

부정 검증은 무인증 명령 또는 별도의 오류 인증 설정 파일을 사용하고, `health:read`가 없는 키·폐기 키·저권한 키로 반복한다. P2 클라이언트 재시도는 외부 Funnel이 아니라 로컬 스텁 서버로 검증해 외부 변동과 분리한다.

### 종료 기준

1. P1 Must 항목이 모두 통과하면 health-only 범위를 수용한다.
2. P2 Must 항목은 `/api/*`를 노출하기 전에 통과한다. P2 미완료는 P1 수용을 막지 않는다.
3. Should 항목은 통과하거나, 실패 시 영향·완화·후속 이슈를 기록해 수용한다.
4. Conditional 항목은 선택 결과에 따라 "적용/해당 없음"과 근거를 남긴다.
5. 테스트 키를 정리하고 Funnel 설정을 원복하며, 증적을 이슈/PR에 첨부한다.
6. Opus의 `funnel-auth-plan.md`와 모순이 없음을 확인하고, Sol의 통합 검증에 본 매트릭스를 인계한다.

### 한계

- 공식 문서 <https://tailscale.com/docs/reference/tailscale-cli/funnel>(Last validated 2026-01-26)를 2026-10-28에 확인했다. Funnel HTTPS 허용 포트는 443/8443/10000, 역방향 프록시 대상은 `http://127.0.0.1`만 지원, TLS 인증서는 자동 발급·tailscaled 종단, `--bg`는 재부팅/tailscaled 재시작 후 자동 재개, 포그라운드는 수동 재시작이 필요하다.
- 실제 구현·배포·Funnel 실행·외부 테스트는 수행하지 않았다. 코드와 실행 환경이 없어 실제 5xx 매핑, Funnel 뒤 출처 IP 가시성, 지연·복구 시간은 실측하지 못했다.
- 본문 크기·TLS 최소 버전·복구 시간·클라이언트 한도는 **제안값**이며, 구현 단계에서 설정값으로 확정한다.
- 현재 구현 대상은 API key뿐이다. JWT/PASETO는 재평가 후보이며 이 문서의 P1/P2 수용 범위가 아니다.
- Opus의 `funnel-auth-plan.md` 개정안(`/health` API key + `health:read`, `/api/*` route별 권한)과 정합성을 확인했다. 이후 문서가 바뀌면 본 문서도 재확인한다.
- 공식 문서 내용은 변경될 수 있으므로 구현 시 재확인한다.
