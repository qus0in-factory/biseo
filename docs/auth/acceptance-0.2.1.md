# 0.2.1 수용조건 — 이슈 #10·#11 (BDD 초안)

> 상태: 구현 전 초안. 시나리오·검증 명령 초안만 제공하며 실행, 비밀 생성·배포는 없다. 근거: 이슈 #10·#11 본문, secrets-0.2.1.md, layers-0.2.1.md, funnel-auth-plan.md 2.2·3.2.

## 공통 전제 (비밀 미노출)

- 검증 명령은 토큰·비밀을 저장소 밖 보호 파일(권한 600)이나 환경변수로만 참조하고, 응답 본문은 `/dev/null`로 버린다. 출력은 상태코드와 쿠키 속성명만 남긴다.
- 실행 변수는 주입 전제로 값 미확정: `$LOGIN_URL` `$PROTECTED_URL` `$HEALTH_URL` `$UPSTREAM_HEALTH_URL` `$CURL_CONNECT_TIMEOUT` `$CURL_MAX_TIME`.
- 음성 시험값(만료·변조·aud 불일치 등)은 실서명 토큰과 분리한 테스트 전용 fixture로 전달받는다 [결정 필요: fixture 관리 방식].

## 이슈 #10 — 비밀번호 로그인·사용자 세션 (Worker)

| ID | 시나리오 | Given | When | Then | 검증 명령(초안) |
|---|---|---|---|---|---|
| L1 | 로그인 성공 | 비밀번호 검증값이 Secret에 설정됨 | 올바른 비밀번호로 `POST /login` | `200`, `Set-Cookie` 정확히 1건(L5 속성) | `curl -sS -o /dev/null -w '%{http_code}\n' -K "$LOGIN_CURL_CONFIG" "$LOGIN_URL"` → 200 (`-K`·본문은 600 파일) |
| L2 | 로그인 실패 | Secret 정상 | 틀린 비밀번호 제출 | `401`, `Set-Cookie` 0건, 고정 문구 | `-K "$LOGIN_CURL_CONFIG_BAD"`로 L1 명령 → 401. 쿠키 0건은 `-w '%{num_headers}'` 대신 `-c "$JAR"`(600) 후 `wc -l`만 출력 |
| L3 | 비밀번호 누락 | Secret 정상 | 비밀번호 필드 없는 본문 | `401` (usage 실패) | `curl -sS -o /dev/null -w '%{http_code}\n' -X POST -d @"$EMPTY_BODY_FILE" "$LOGIN_URL"` → 401 |
| L4 | Secret 누락 fail-closed | 검증값 Secret 미구성 | L1과 동일 시도 | `500` 또는 `503`, `Set-Cookie` 0건 (`200` 금지) | L1 명령을 Secret 미구성 로컬 프로파일에서 → 500/503 |
| L5 | 쿠키 속성 | 로그인 성공 | `Set-Cookie` 검사 | `Secure; HttpOnly; Path=/; SameSite=<값>; Max-Age=<양의 정수>` (값은 ../decisions-0.2.1.md) | `curl -si -o /dev/null -c "$JAR" -K "$LOGIN_CURL_CONFIG" "$LOGIN_URL"` 후 `grep -ioE 'secure\|httponly\|samesite=[a-z]+\|path=/\|max-age=[0-9]+' "$JAR_HEADERS"` — 속성명만 출력 |
| L6 | 만료·변조·aud 불일치 | 만료 / 위조 / 다른 audience 로그인 쿠키 | 보호 API `GET /api/health` | 각각 `401` | `curl -sS -o /dev/null -w '%{http_code}\n' -K "$COOKIE_{EXPIRED,TAMPERED,FOREIGN_AUD}_CONFIG" "$PROTECTED_URL"` → 각 401 |
| L7 | 서비스→세션 재사용 거부 | 서비스용 PASETO(`Purpose=service`) | 사용자 보호 API에 제시 | `401` (용도·audience 분리) | `curl -sS -o /dev/null -w '%{http_code}\n' -K "$COOKIE_SERVICE_AS_CONFIG" "$PROTECTED_URL"` → 401 |
| L8 | 로그아웃·시도 제한 | 성공한 세션 | 로그아웃 후 동일 세션 재요청 / 연속 실패 `$LOGIN_MAX_ATTEMPTS`회 초과 | 재사용 `401`; 초과 시 `429`(또는 `401` 유지+잠금, 결정 항목) | `POST /logout` 후 L1 쿠키 재사용 → 401. 실패는 `$LOGIN_MAX_ATTEMPTS`+1회 → 마지막 응답 코드 확인 (임계치: ../decisions-0.2.1.md) |

## 이슈 #11 — PASETO 서비스 인증 (Worker→backend)

| ID | 시나리오 | Given | When | Then | 검증 명령(초안) |
|---|---|---|---|---|---|
| S1 | Worker 정상 호출 | Worker가 서비스 자격증명 보유 | upstream health 위임 호출 | `200` | `curl -sS -o /dev/null -w '%{http_code}\n' -K "$SERVICE_CURL_CONFIG" --max-time "$CURL_MAX_TIME" "$UPSTREAM_HEALTH_URL"` → 200 |
| S2 | Funnel 직접 접근 | 토큰 없음 | `$HEALTH_URL` 직접 요청 | `401` | `curl -sS -o /dev/null -w '%{http_code}\n' --connect-timeout "$CURL_CONNECT_TIMEOUT" --max-time "$CURL_MAX_TIME" "$HEALTH_URL"` → 401 |
| S3 | 무효 서비스 토큰 | 만료 / 변조 / 다른 issuer·audience | backend 검증 요청 | 각각 `401` | 상기 S1 형식으로 `$SERVICE_{EXPIRED,TAMPERED,FOREIGN_AUD}_CONFIG` → 각 401 |
| S4 | 세션→서비스 재사용 거부 | 사용자 세션 토큰 | 서비스 인증으로 제시 | `401` (키·용도 분리) | S1 형식으로 `$COOKIE_SESSION_AS_CONFIG` → 401 |
| S5 | 호출 대상·TLS 제한 | Worker 설정에 허용 endpoint 고정 | 미승인 대상 호출 / TLS 비활성 시도 | 미승인 대상 요청 `0건`·`403` 오류, TLS 검증 끄는 옵션은 설정 거부 | `pnpm test`(health-ky 허용 호스트·TLS 단정, 스위트 범위 [미확정]) |
| S6 | 키 교체·폐기 | 신·구 `SERVICE_PASETO_SECRET` | 구 키 토큰 제시 (교체 후) | 폐기 키 `401`, 신 키 `200`; 교체 절차·토큰 수명은 secrets-0.2.1.md | S1 형식으로 `$SERVICE_OLDKEY_CONFIG` → 401, 신 키 → 200 |
| S7 | 설정 누락·잘못된 키 | 키 미설정 / 길이·형식 오류 키 | 서버·Worker 기동 | 기동 실패(비정상 종료), 요청 `200` 없음 | `pnpm test` 설정 부정시험 (종료코드만 확인) |
| S8 | IP·전달헤더 불신 | 유효 토큰 없음 | `X-Forwarded-For`·내부 IP로 위장 | 항상 `401` | S2 명령에 `-H @"$SPOOF_HEADER_FILE"` → 401 |
| S9 | 로그·오류 비노출 | 위 모든 실패 시나리오 | 로그·응답·오류 수집 | 토큰·키·비밀번호 문자열 0건 | 수집 파일을 `grep -cF -f "$SECRET_PATTERN_FILE"`(600) → 0, 개수만 출력 |

## 비고

- 확정 대기 항목: Secret 3종 명칭, 쿠키 `SameSite`/`Max-Age`, issuer/audience 값 — secrets-0.2.1.md 결정 항목을 따른다.
- 응답 본문은 고정 문구 원칙(funnel-auth-plan.md 2.2)을 따르며, 로그·오류·쿠키 속성 검사 출력에 토큰·키를 포함하지 않는다.
- 0.2.0 외부 노출 판정(안전 게이트, ../exposure/healthcheck-acceptance.md)은 이 문서로 변경하지 않는다.
