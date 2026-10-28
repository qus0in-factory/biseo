---
audience: user
---
# 0.2.1 결정 항목 (제안만, 값 없음)

결정자는 모두 사용자. 권장안은 제안이며 확정 전 구현 금지.

| # | 항목 | 권장안 | 근거 | 결정자 |
|---|---|---|---|---|
| 1 | Secret 3종 명칭 | `AUTH_PASSWORD_VERIFIER`, `USER_SESSION_PASETO_SECRET`, `SERVICE_PASETO_SECRET` | [secrets §1](auth/secrets-0.2.1.md) | 사용자 |
| 2 | 쿠키 SameSite | `Lax` (`Strict`은 대안) | [secrets §4](auth/secrets-0.2.1.md) | 사용자 |
| 3 | 쿠키 Max-Age | 유한값, 토큰 만료와 동일 (구체값 미정) | [secrets §4](auth/secrets-0.2.1.md), [L5](auth/acceptance-0.2.1.md) | 사용자 |
| 4 | issuer/audience | issuer `biseo`(기존 `ISSUER`), audience는 `Purpose`별 분리 | [layers](auth/layers-0.2.1.md), [S3](auth/acceptance-0.2.1.md) | 사용자 |
| 5 | 토큰 만료 | 세션·서비스 분리, 서비스는 단기 (값 미정) | [secrets §5](auth/secrets-0.2.1.md) | 사용자 |
| 6 | 로그인 시도 제한 | 실패 반복 제한 도입, 임계치는 설정 주입 | [L8](auth/acceptance-0.2.1.md) | 사용자 |
| 7 | 포트명 | `PasswordVerifier`, `HealthUpstream` | [layers](auth/layers-0.2.1.md) | 사용자 |
| 8 | fixture 방식 | 실서명 토큰과 분리한 테스트 전용 fixture, 저장소 밖 보호 파일(600) | [acceptance 공통 전제](auth/acceptance-0.2.1.md) | 사용자 |
| 9 | 새로고침 세션 복원 | HttpOnly 쿠키 기반, UI는 보호 API로 세션 확인 (경로 미정) | [secrets §4](auth/secrets-0.2.1.md), [L6](auth/acceptance-0.2.1.md) | 사용자 |
| 10 | PBKDF2 반복 횟수 | 100,000 유지+비밀번호 길이·엔트로피 강화 또는 대안 알고리즘 재평가 (OWASP 권고 600,000 미달 트레이드오프) | [workerd 상한 100,000](https://github.com/cloudflare/workerd/issues/1346), [OWASP 권고](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) | 사용자 |

## 추가 미결
- backend 검증키 경로·형식, PASETO 버전 확정 ([secrets §2·§4](auth/secrets-0.2.1.md)).
- 항목 9는 기존 문서에 명시 결정이 없어 권장안은 신규 제안이다.
