# 0.2.0 REST 검증 기록

일시: 2026-10-28T07:21:39Z–07:21:47Z
범위: `localhost:6543/health`, Funnel `/health`, `localhost:8787/api/health`, `localhost:8787/`, 빌드 정적 assets
도구: `curl --connect-timeout 5 --max-time 15`
비수행: 코드·설정·의존성 변경, typecheck/build 재실행(Sol 통과), 새 프로세스 시작·종료, 커밋·푸시

## 결과

| # | URL | HTTP | 핵심 응답 |
|---|---|---|---|
| 1 | `http://127.0.0.1:6543/health` | `200` | `application/json`, 15 bytes, `{"status":"ok"}` |
| 2 | `https://<device>.<tailnet>.ts.net/health` | `200` (HTTP/2) | `application/json`, 15 bytes, `{"status":"ok"}` |
| 3 | `http://127.0.0.1:8787/api/health` | `200` | `application/json`, 15 bytes, `{"status":"ok"}` |
| 4 | `http://127.0.0.1:8787/` | `200` | `text/html; charset=utf-8`, `Biseo Health` HTML |
| 5 | `http://127.0.0.1:8787/assets/index-Ccj3eIsL.js` | `200` | `text/javascript`, 250,897 bytes |
| 6 | `http://127.0.0.1:8787/assets/index-D_eigzad.css` | `200` | `text/css`, 256 bytes |

## 증적

- 1번은 첫 시도에 성공했고 PM2 경로 교체로 인한 60초 재시도 구간은 발생하지 않았다.
- 2번은 `content-type: application/json`, `content-length: 15`; 1번과 같은 본문이다.
- 3번은 Worker 경유 health이며 1·2번과 같은 본문이다.
- 4번 HTML은 `/assets/index-Ccj3eIsL.js`와 `/assets/index-D_eigzad.css`를 참조한다. `CF-Cache-Status: HIT`.
- 5·6번은 4번이 참조한 실제 assets이며, HTTP 바이트 수가 `dist/client/assets/`의 로컬 파일 크기(250,897 / 256)와 일치한다. 두 응답 모두 `CF-Cache-Status: HIT`.
- 모든 `curl`은 exit 0, 성공 코드만 기록했다. 인증 키는 사용하지 않았다.

## 판정과 한계

- 필수 REST 검증 6건은 모두 통과했다: PM2 health, Funnel HTTPS health, Worker `/api/health`·`/`, 빌드 JS·CSS 서빙.
- `FUNNEL_HEALTH_URL`을 불가 주소로 오버라이드한 502 실패 처리 검증은 수행하지 않았다. 별도 Worker 프로세스를 띄우지 않았고 운영 설정도 변경하지 않았다.
- typecheck/build는 Sol이 이미 통과했다는 전제를 따랐으며 이번 검증에서 재실행하지 않았다.
- Funnel·PM2·Worker 설정 변경, 서비스 재시작, 새 프로세스 생성, 커밋·푸시는 없었다.

## 통합 담당 추가 검증

운영 설정을 바꾸지 않는 별도 임시 로컬 Worker에서 upstream 연결 거부 시 502/bad_gateway, 지연 스텁의 시간초과 시 504/timeout을 확인했다. 테스트가 만든 프로세스 그룹과 스텁 서버만 정리했다. 공개 Worker `/`와 `/api/health`도 HTTP200으로 확인했다.
