> 이 문서는 이전 상세 설계·검토 기록이다. 최신 0.1.0은 Hono + pnpm + PM2, 로컬 6543 → Funnel 443의 무인증 /health HTTP 200만 목표로 한다. 인증과 상세 운영 조건은 다음 단계로 보류하며 현재 출시에 적용하지 않는다. 최신 범위는 funnel-issue-plan.md와 backlog.md를 따른다.

# Funnel 공개 및 API 인증 계획

> 상태: 계획 단계. 아직 구현, 실행, 활성화한 것은 없다.
> 표기: **[사실]**은 공식 문서로 확인한 내용, **[제안]**은 이 문서가 권하는 결정, **[결정 필요]**는 아직 확정하지 않은 값이다.
> 근거(2026-10-28 확인):
> - [TS-CLI] [Funnel CLI](https://tailscale.com/docs/reference/tailscale-cli/funnel)
> - [TS-FEAT] [Tailscale Funnel](https://tailscale.com/docs/features/tailscale-funnel)
> - [RFC8725] [JWT BCP](https://www.rfc-editor.org/rfc/rfc8725.html)
> - [PASETO] [PASETO spec](https://github.com/paseto-standard/paseto-spec)
> - [OWASP] [REST Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html)

## 1. Why

- 외부에서 HTTPS 443으로 biseo가 살아 있는지 확인할 수 있어야 한다.
- 사용자 요구는 **여기서 서빙하는 모든 것이 인증을 거치는 것**이다.
- **HTTPS/TLS와 인증·인가는 별개의 문제다.**
  - TLS가 보장하는 것: 전송 구간의 기밀성과 무결성, 그리고 서버가 진짜인지.
  - 인증이 보장하는 것: 호출자가 누구인지.
  - 인가가 보장하는 것: 그 호출자가 무엇을 해도 되는지.
  - Funnel은 TLS를 제공하지만, 공개 URL에는 누구나 접근할 수 있다. 따라서 인증·인가는 애플리케이션이 맡아야 한다. 근거: [TS-FEAT](https://tailscale.com/docs/features/tailscale-funnel)

## 2. What

### 2.1 Funnel 공개 경계

- [사실] TLS는 relay가 아니라 기기의 Tailscale 프로세스가 종료한다. 복호화된 요청은 로컬 서비스로 전달된다. 근거: [TS-FEAT](https://tailscale.com/docs/features/tailscale-funnel)
- [사실] reverse proxy 대상으로는 현재 `http://127.0.0.1`만 지원한다. 근거: [TS-CLI](https://tailscale.com/docs/reference/tailscale-cli/funnel)
- [사실] Funnel 포트는 443, 8443, 10000만 쓸 수 있다. 근거: [TS-CLI](https://tailscale.com/docs/reference/tailscale-cli/funnel), [TS-FEAT](https://tailscale.com/docs/features/tailscale-funnel)
- [사실] 같은 포트를 Serve와 Funnel에 동시에 쓸 수 없다. 근거: [TS-FEAT](https://tailscale.com/docs/features/tailscale-funnel)
- [사실] 호스트명은 `<기기>.<tailnet>.ts.net` 형태다. 새 URL의 DNS가 전파되기까지 최대 10분이 걸릴 수 있다. Funnel은 beta이고 기본으로 꺼져 있다. 근거: [TS-FEAT](https://tailscale.com/docs/features/tailscale-funnel)
- [제안] 앱은 `127.0.0.1:<APP_PORT>`에만 bind한다. 등록하지 않은 경로는 404로 응답한다.

### 2.2 health와 인증 정책

| 경로 | 초기안 [제안] | 향후 [제안] |
|---|---|---|
| `GET /health` | API key 필수, scope `health:read` | 유지 |
| `/api/*` | 구현 전에는 노출하지 않는다 | route별 권한(scope) |

- [제안] `/health`는 **liveness** 확인 전용이다. 프로세스가 응답하는지만 알리고, 의존성 점검(readiness)은 포함하지 않는다.
- [제안] `/health` 응답은 `200 {"status":"ok"}`만 담는다. 버전, 호스트, 의존성 같은 내부 정보는 넣지 않는다.
- [제안] `/api/*`는 아직 제공하지 않으므로 404로 응답한다. 따라서 지금은 인증 테스트 대상이 아니다. 인증 테스트는 `/health`에 한정하고, `/api/*` route를 도입할 때 권한 테스트를 함께 추가한다.
- [제안] 인증 실패는 `401`, scope 부족은 `403`으로 응답한다. 본문은 고정 문구로 둔다. 근거: [OWASP](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html)
- [보류] 인증 없는 공개 health는 사용자가 승인하기 전까지 제공하지 않는다.
- [결정 필요] 인증 실패에 대한 rate limit의 값과 기간.

### 2.3 인증 방식 비교

| 기준 | API key (opaque) | JWT (JWS) | PASETO |
|---|---|---|---|
| 보호 방식 | 무작위 문자열을 서버 저장소와 대조한다 | 서명만 한다. 암호화가 아니어서 payload를 누구나 읽을 수 있다 | `public`은 서명만, `local`은 인증된 암호화 |
| 검증 | 서버가 저장소를 조회 | 서명 검증 (stateless) | 서명 또는 복호화 검증 (stateless) |
| 즉시 폐기 | 쉽다 (목록에서 삭제) | 만료를 기다리거나 denylist가 필요하다 | 만료를 기다리거나 denylist가 필요하다 |
| 주의점 | 유출되면 폐기할 때까지 유효하다 | `alg` 혼동이나 `none` 허용을 막으려면 알고리즘 허용 목록이 필요하다 | 버전마다 알고리즘이 고정되어 있다. 생태계는 좁다 |

근거:
- 보호 방식과 주의점: [RFC8725](https://www.rfc-editor.org/rfc/rfc8725.html), [PASETO](https://github.com/paseto-standard/paseto-spec)
- API key의 성격: [OWASP](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html)

#### 초기안 [제안]

- 워커별 opaque API key를 `Authorization: Bearer <key>`로 받는다.
- 서버에는 키 해시와 `key_id`, `scope`만 저장하고, 비교는 상수 시간으로 한다.
- 지금은 발급자와 검증자가 biseo 하나뿐이다. 따라서 stateless 토큰이 필요하지 않다(YAGNI).

#### 재평가 조건 [제안]

- 짧은 수명의 위임 토큰이나 분산 검증이 필요해지면 JWT와 PASETO를 다시 평가한다.
- 평가 항목:
  - 유지보수되는 라이브러리가 있는지
  - 호환성
  - 키 관리
  - 폐기 정책
- 평가 후 둘 중 한 방식만 선택한다.
- JWT를 선택하면 RFC 8725를 적용한다. 핵심은 알고리즘 허용 목록, `iss`·`aud` 검증, 짧은 만료다. 근거: [RFC8725](https://www.rfc-editor.org/rfc/rfc8725.html)

#### 범위 경계 [제안]

- API key 하나만으로 민감하거나 권한이 높은 API를 보호하지 않는다. 근거: [OWASP](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html)
- 그런 기능을 도입하기 전에 더 강한 접근 통제를 별도로 결정한다. 후보는 mTLS, 사용자 인증, tailnet 전용 Serve 등이다.

### 2.4 시크릿 저장, 회전, 폐기 [제안]

- **생성**: 키는 CSPRNG로 생성한다. 예를 들어 OS 난수원이나 언어 표준 `secrets` 계열을 쓴다. 직접 만든 난수 로직은 쓰지 않는다.
- **관리 분리**
  - 원문: 워커 쪽 보호된 파일에만 둔다. 서버에는 두지 않는다.
  - 해시: 서버의 인증 설정에 둔다.
  - 권한: 서버의 인증 설정에 `key_id`별 scope로 둔다.
- **fail-closed**
  - 인증 설정이 없거나 비어 있거나 파싱에 실패하면 서비스는 기동하지 않는다.
  - 인증 설정이 유효하다는 것이 확인되기 전에는 Funnel을 노출하지 않는다.
  - 인증 우회 플래그(dev mode 등)는 운영 설정에 두지 않는다.
- **저장**
  - 키 원문은 발급할 때 한 번만 전달한다.
  - 서버는 저장소 밖의 설정 파일이나 환경 변수에서 해시 목록을 읽는다. 시크릿은 하드코딩하지 않는다.
  - 시크릿 파일은 `.gitignore`에 넣고, 커밋 전에는 `.gitignore`를 검토한다.
- **회전**: 새 키와 기존 키가 함께 유효한 겹침 기간을 둔다. 교체가 끝나면 기존 키를 제거한다.
- **폐기**: 해시 목록에서 키를 삭제하고 설정을 다시 읽는다. 유출이 의심되면 즉시 폐기하고 재발급한다.
- **로그**: `key_id`만 남긴다. 키 원문과 `Authorization` 헤더는 기록하지 않는다. 근거: [OWASP](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html)
- [결정 필요] 저장 위치, 키 길이, 해시 알고리즘, 회전 주기, 겹침 기간.

## 3. How

### 3.1 사전 조건 (확인만 하고 변경하지 않는다)

- [사실] 다음 조건이 필요하다. 근거: [TS-FEAT](https://tailscale.com/docs/features/tailscale-funnel)
  - Tailscale 1.38.3 이상
  - MagicDNS와 HTTPS 인증서 활성화
  - 정책 파일 `nodeAttrs`의 `funnel` 속성. 없으면 CLI가 `autogroup:member`를 대상으로 자동 추가한다.
  - 반복된 인증서 요청은 Let's Encrypt rate limit에 걸릴 수 있다.
- [미확정] macOS 지원 여부가 두 공식 페이지에서 다르게 설명된다.
  - feature 페이지는 오픈소스 변형이 필요하다고 한다. 근거: [TS-FEAT](https://tailscale.com/docs/features/tailscale-funnel)
  - CLI 페이지는 App Store와 Standalone 변형에서도 포트 공유는 된다고 한다. 근거: [TS-CLI](https://tailscale.com/docs/reference/tailscale-cli/funnel)
  - 설치본과 최신 문서를 확인하기 전까지 macOS 지원은 미확정으로 둔다.
- [제안] `funnel` 속성의 대상을 운영 기기나 태그로 좁힌다.
- [결정 필요] 공개할 기기, tailnet 호스트명, `APP_PORT`, 설치할 Tailscale 변형.

### 3.2 명령 (계획만 적으며 실행하지 않는다)

```shell
# 0) 기존 Serve/Funnel 설정을 조회 증적으로 남긴다. 저장 경로는 결정 필요.
tailscale serve status --json > "$SNAPSHOT_DIR/serve.json"
tailscale funnel status --json > "$SNAPSHOT_DIR/funnel.json"

# 1) 노출: 443 → 로컬 앱. --bg로 실행하면 재부팅 후에도 유지된다.
tailscale funnel --bg --https=443 "http://127.0.0.1:$APP_PORT"

# 2) 확인: tailnet 밖에서 실행한다. 키 없이 401, 키가 있으면 200이어야 한다.
#    타임아웃은 설정에서 주입한다. 키는 보호된 curl 설정 파일에서만 읽는다.
curl -sS -o /dev/null -w '%{http_code}\n' \
  --connect-timeout "$CURL_CONNECT_TIMEOUT" --max-time "$CURL_MAX_TIME" \
  "$HEALTH_URL"
curl -fsS --config "$AUTH_CURL_CONFIG" \
  --connect-timeout "$CURL_CONNECT_TIMEOUT" --max-time "$CURL_MAX_TIME" \
  "$HEALTH_URL"

# 3) 중지: 대상 443만 끈다. 노출할 때와 같은 플래그에 off를 붙인다.
tailscale funnel --https=443 off
```

`AUTH_CURL_CONFIG`가 가리키는 파일은 저장소 밖에 두고 권한을 `600`으로 제한한다. 파일 내용은 다음과 같다.

```text
header = "Authorization: Bearer <KEY>"
```

- [제안] 키를 `-H` 인수로 넘기지 않는다. 인수로 넘기면 `ps` 출력이나 셸 히스토리, 로그에 남는다.
- [제안] `set -x` 같은 셸 추적은 쓰지 않는다.
- [결정 필요] `HEALTH_URL`, `APP_PORT`, `SNAPSHOT_DIR`, `AUTH_CURL_CONFIG`, `CURL_CONNECT_TIMEOUT`, `CURL_MAX_TIME`의 값.
- 명령 근거: [TS-CLI](https://tailscale.com/docs/reference/tailscale-cli/funnel)

#### 기존 설정 보호 [제안]

- **소유 범위 확인**
  - 0단계 조회에서 443을 쓰는 Serve나 Funnel 설정이 있으면, 1단계로 넘어가지 않는다.
  - 먼저 그 설정의 소유자와 용도를 확인하고, 덮어써도 되는지 승인을 받는다.
  - 근거: 같은 포트는 마지막에 실행한 설정이 우선한다. [TS-FEAT](https://tailscale.com/docs/features/tailscale-funnel)
- **snapshot의 성격**: snapshot은 자동으로 복원할 수 있는 백업이 아니다. 무엇이 있었는지 보여주는 조회 증적일 뿐이다.
- **복구**
  - 3단계로 443을 끈 뒤에는, 증적을 보고 기존 구성을 해당 `serve`/`funnel` 명령으로 직접 다시 적용한다.
  - 다시 적용한 뒤 `status --json`을 증적과 비교해서 검증한다.
  - 복구 절차와 결과는 운영 기록에 남긴다.
- [제안] `tailscale funnel reset`은 일반 중지 절차로 쓰지 않는다.
  - 이 명령은 호스트의 Funnel 설정 전체를 지운다. 다른 서비스가 같은 설정을 공유하고 있으면 함께 사라진다.
  - 별도 승인이 있을 때만 다룬다.

### 3.3 실행 순서 [제안]

1. 3.1의 결정 필요 항목과 미확정 항목을 확정한다.
2. `/health`와 API key 미들웨어(`health:read`)를 구현하고 테스트한다. 수용 기준은 DS의 acceptance 문서를 따른다.
3. 로컬에서 두 가지를 확인한다.
   - bind 주소가 `127.0.0.1`인지
   - 키 없이 요청하면 401, 키가 있으면 200인지
4. 조회 증적을 남기고 443의 소유 범위를 확인한다. 그다음 Funnel을 노출하고, DNS 전파를 기다렸다가 외부에서 확인한다.
5. 운영 기록(Sol 담당)에 노출과 중지 시각, 결과를 남긴다.

## 4. 한계

- 대역폭 수치, beta 기능의 향후 변경, 이 환경의 Tailscale 변형과 버전은 확인하지 않았다.
- 코드가 없으므로 미들웨어 설계는 원칙 수준에 머문다.
