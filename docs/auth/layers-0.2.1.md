# 0.2.1 레이어 맵 (이슈 #10, #11)

(신규)=아직 없음·제안. 포트 이름은 기존 `ports.ts` 외 제안안.

| 레이어 | 모듈 경로 | 포트/인터페이스 | 담당 |
|---|---|---|---|
| ui | `web/App.tsx`, `web/useHealth.ts`, `web/resources.json`, 로그인 화면(신규) | — (app의 HTTP API만 호출) | spark |
| ui | `worker/index.ts` 라우트(Hono 입출력, 쿠키), `src/index.ts` `/health` | — | gf(worker), 후속(src) |
| app | `worker/app/login.ts`, `worker/app/health.ts`(신규) | 사용: `ClaimsSigner`, `ClaimsVerifier`, `PasswordVerifier`(신규), `HealthUpstream`(신규) | gf |
| app | `src/app/verify-service.ts`(신규) | 사용: `ClaimsVerifier` | 후속 |
| domain | `shared/domain/{claims,issue,validate,guards}.ts` | 정의: `ClaimsSigner`, `ClaimsVerifier`(`ports.ts`) | ds-o |
| infra | `shared/infra/{paseto-v4-public,keys}.ts` | 구현: `PasetoV4PublicSigner`→`ClaimsSigner`, `PasetoV4PublicVerifier`→`ClaimsVerifier` | ds-o |
| infra | `worker/infra/password.ts`, `worker/infra/secrets.ts`, `worker/infra/health-ky.ts`(신규) | 구현: `PasswordVerifier` 구현(정의는 worker/app 단일화 예정), `HealthUpstream`(ky, 설정된 HTTPS endpoint만) | gf |
| infra | `src/config.ts`, `src/infra/*`(신규) | Secret/환경 설정 로드 | 후속 |

## 의존 방향
- ui → app → domain ← infra (infra가 domain 포트를 구현, 내부는 외부 구현을 참조하지 않음)
- domain은 프레임워크·라이브러리 무참조. `Purpose`(`user-session`/`service`)로 키·audience 분리.
- 조립(주입)은 진입점 `worker/index.ts`, `src/index.ts`에서만 수행.

## 후속 작업
- `src` 서비스 토큰 검증(#11), worker 로그인 통합(#10 + 쿠키·제한·로그아웃)은 후속.
- `shared/**` 수정은 ds-o만. 다른 담당은 포트 변경 필요 시 ds-o에 요청.
