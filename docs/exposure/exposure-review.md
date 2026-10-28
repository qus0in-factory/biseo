> 이 문서는 이전 상세 설계·검토 기록이다. 최신 0.1.0은 Hono + pnpm + PM2, 로컬 6543 → Funnel 443의 무인증 /health HTTP 200만 목표로 한다. 인증과 상세 운영 조건은 다음 단계로 보류하며 현재 출시에 적용하지 않는다. 최신 범위는 exposure/funnel-issue-plan.md와 backlog.md를 따른다.

# Funnel 노출 운영 독립 검토 (glm-z)

> 작성: glm-z · 2026-10-28 · 범위: 기존 3개 문서의 운영 관점 독립 검토. 구현·실행·설정 변경·커밋·게시 없음.
> 대상: auth/funnel-auth-plan.md(Opus), exposure/healthcheck-acceptance.md(ds-o), release/planning-coordination.md(sol)
> 근거: [TS-CLI] funnel CLI(Last validated 2026-01-26), [TS-FEAT] Tailscale Funnel(2026-01-20) — 둘 다 2026-10-28 재확인. URL은 각 문서 상단 인용과 동일.
> 표기: **[사실]**=공식 문서·작업 공간 관찰로 확인, **[제안]**=이 검토의 권고, **[미확정]**=확인 전까지 보류, **[차단]**=지침상 수행 불가.

## Why

- 1차 수용 범위(health-only + TLS + 워커별 API key `health:read`, 무인증 401·권한 부족 403, loopback bind, 설정·비밀 하드코딩 금지)는 세 문서에서 서로 정합하다. plan 2.2·3.3, AC-06/08/11/16, coordination 4단계와 일치한다. **[사실]**
- 다만 세 문서는 백엔드 장애·복구(AC-16/17)는 다루지만 **Funnel 설정 경계**(Serve 443 충돌, off 재현, DNS 전파 지연)와 **인증 구성 자체의 누락**은 부분적으로 비어 있어, 노출 전에 고정할 가치가 있다.

## What

1. **기존 443/Serve 설정 충돌** — [사실] 같은 포트를 Serve와 Funnel에 동시에 쓸 수 없고, 마지막 명령이 공개 범위를 결정한다(`serve`면 완전 비공개, `funnel`이면 완전 공개). 근거: [TS-FEAT]. [제안] 노출 전 `tailscale serve status`를 `funnel status --json`과 함께 스냅샷하고, 노출 뒤 status로 443이 공개로 전환됐는지 재확인한다. AC-03은 funnel 마운트만 검사한다(ds-o). [제안] Funnel 대상 표기는 `localhost` 대신 `http://127.0.0.1`로 통일한다. proxy 지원 대상은 `http://127.0.0.1`뿐임을 [TS-CLI]가 명시하고, `localhost`가 `::1`로 풀리는 환경을 배제한다.
2. **.gitignore와 비밀 저장** — [사실] biseo 저장소에 `.gitignore`가 아직 없다. plan 2.4("시크릿 파일은 `.gitignore`에 넣고")의 전제만 존재한다. [제안] 비밀 설정 파일이 생기기 전에 `.gitignore`를 먼저 만든다. 이번에 커밋·비밀 생성은 하지 않으므로 [차단] 아님: 사전 조치로 남긴다. 커밋 전 `.gitignore` 검토는 AGENTS.md의 필수 절차와 일치한다.
3. **인증 설정 누락 시 fail-closed** — [제안] plan 2.4는 키 해시 목록을 설정/환경변수에서 읽지만, 목록이 비었거나 환경변수가 없을 때의 동작이 정해져 있지 않다. 빈 목록을 "인증 생략"으로 해석하면 무인증 401(AC-08)이 설정 존재에 의존하게 된다. 시작 시 유효 키 해시가 0개면 health를 상시 401로 강제하거나 기동을 거부하는 fail-closed 조건을 AC-08 전제에 추가할 것을 제안한다.
4. **외부 검증 전제·증적 마스킹** — [사실] 외부 회선 검증, 시크릿 주입, 마스킹 증적(증적에 자격증명·쿠키·내부 주소 금지)은 ds-o의 검증 전제에 이미 명시돼 있다. [사실] 공개 DNS 전파는 최대 10분 걸릴 수 있다. 근거: [TS-FEAT]. [제안] 검증 매트릭스 P1 외부 443 행에 DNS 준비 확인(외부 resolver 조회)과 전파 대기 후 재시도 상한을 넣어 AC-01의 오동작 판정을 막는다. [제안] Funnel URL은 공개 DNS에 실리므로, 인증 강화가 완료되기 전 공개 이슈·PR에는 호스트를 마킹해 남긴다.
5. **장애 시 중지·원복** — [사실] off는 `<target>` 선택적이나 원래 플래그 전부가 필요하고, `--bg`는 재부팅·tailscaled 재시작 후 자동 재개, 포그라운드는 수동 재개다. 근거: [TS-CLI]. plan 3.2의 "같은 플래그에 off" 서술은 이와 정합하다. [제안] 그러나 off 재현 요건을 검증하는 AC는 없다. 노출 명령의 원문을 sol의 운영 기록에 보관하고, "그 명령 + off"를 그대로 수행하는 절차와 AC(`--set-path` 포함 여부 포함)를 ds-o가 Should로 추가할 것을 제안한다. `reset`은 호스트의 Funnel 설정 전체를 지우므로 정상 중지로 쓰지 않는다는 plan 서술도 [사실]과 일치한다. 백엔드 장애 시 Funnel 설정 유지는 AC-16이 이미 요구한다.
6. **macOS 배포형 문서 불일치** — [사실] 공식 문서 간 모순이 실제로 남아 있다. [TS-FEAT] 제한 목록은 "macOS에서 Funnel은 오픈소스 변형이 필요하다"고 하지만, 같은 페이지의 macOS 경고와 [TS-CLI]는 App Store·Standalone에서도 **포트 공유**는 가능하고 파일·디렉터리 공유만 불가하다고 말한다. P1은 역방향 프록시(파일 서버 아님)라서 후자에 방향이 맞는다. **[미확정]** 이 기기의 설치 변형·Tailscale 버전은 확인하지 않았다 — tailscale 실행은 이번 범위 밖이다. 노출 전 변형·버전 확인을 전제조건으로 둔다.

### 구분 요약

| 구분 | 항목 |
|---|---|
| 사실 | Serve/Funnel 포트 상충·마지막 명령 우선([TS-FEAT]), off 플래그 재현·`--bg` 자동 재개·reset 전역 삭제([TS-CLI]), DNS 전파 최대 10분([TS-FEAT]), 세 문서 간 401/403/loopback/하드코딩 금지 정합, biseo에 `.gitignore` 부재, macOS 공식 문서 모순의 존재 |
| 제안 | serve status 사전 확인, fail-closed 기동 조건, DNS 준비 단계, off 원문 재현 런북·AC, `.gitignore` 선제 작성, 공개 문서의 host 마킹, 대상 표기 127.0.0.1 고정 |
| 미확정 | 이 기기의 macOS 변형·Tailscale 버전, Funnel 뒤 출처 IP 가시성·5xx 매핑 실측(ds-o도 미실측), plan의 결정 필요 항목(저장 위치·키 길이·회전·rate limit 값) |
| 차단 | 코드·서버·Funnel 실행, 비밀 생성, 설치, 외부 설정 변경, 커밋·푸시, GitHub 게시, 추가 워커 실행 — 이번 검토는 문서 작성만 수행했다 |

## How

- 이 검토는 구현·설정을 바꾸지 않았다. 위 제안의 수용 여부는 각 담당이 판단한다: Opus = plan 2.4 fail-closed 조건, ds-o = AC-03 serve 확인·AC-08 fail-closed 전제·DNS 단계·off 재현 AC, sol = 운영 기록에 노출·off 명령 원문 보관과 이슈 반영.
- 공식 문서 검증 시점은 2026-10-28이며 Last validated가 2026-01 이후다. 노출 단계 진입 시 다시 확인한다. 이 문서의 수정은 이슈 반영(sol) 시에만 논의한다.

### 통합 처리 (sol)

- 검토 당시 읽은 초안 이후 Opus 문서에 Serve/Funnel 조회·fail-closed·소유범위 확인·수동 원복 절차가 반영되었다. 위의 누락 지적은 검토 시점의 관찰이다.
- 수용 조건 AC-23~25에 인증 설정 누락·기존 설정/DNS 준비·대상 중지와 복구 검증을 추가했다. `.gitignore`는 실제 비밀 파일 생성·커밋 전 준비할 작업으로 남겼다.
- [Funnel CLI 원문](https://tailscale.com/docs/reference/tailscale-cli/funnel), [Funnel 요구사항 원문](https://tailscale.com/docs/features/tailscale-funnel). 실제 노출·장애 테스트는 수행하지 않았다.
