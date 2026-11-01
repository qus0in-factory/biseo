# 0.4.3 플랫폼 보안 점검 (영역 B)

- 기준: OWASP Top 10:2025, OWASP ASVS 5.0.0(2025-05-30 안정판)
- 범위: 의존성·공급망, 보안 헤더·CSP, 비밀 관리·git 이력, CI 점검 자동화, 프런트 XSS·마크다운 렌더링
- 기준 커밋: `d6c55be` (`origin/dev`), 브랜치 `security/043-platform`
- 제한: 비밀값은 출력하지 않았다. 운영 대상 공격성 탐색은 하지 않았고, 저장소·빌드 산출물·git 이력만 정적 검토했다.

## 요약

| ID | 위험도 | 항목 | 조치 | 상태 |
| --- | --- | --- | --- | --- |
| H-1 | 높음 | 취약한 개발 의존성 2건(pm2 경로) | pm2 7.1.1로 갱신, 회귀 테스트 추가 | 수정 |
| M-1 | 중간 | CSP·보안 헤더 부재(Worker·Node·정적 자산) | 공통 헤더 모듈, 미들웨어, `_headers` 추가 | 수정 |
| M-2 | 중간 | 의존성·비밀 이력 CI 점검 부재 | `security.yml` 주간/PR 스캔 추가 | 수정 |
| L-1 | 낮음 | git 이력의 tailnet 호스트명 | 이력 보존, 잔여 위험 문서화 | 문서화 |
| L-2 | 낮음 | 테스트의 비밀번호 리터럴 | 테스트 전용 값 확인, 정보성 탐지 유지 | 문서화 |
| L-3 | 낮음 | 로컬 `.env` 권한 644 | 600으로 제한(저장소 외부) | 수정 |
| L-4 | 낮음 | 마크다운·Mermaid XSS 잔여면 | 기존 방어 확인, 링크 회귀 테스트 추가 | 문서화 |
| L-5 | 낮음 | CSP `style-src 'unsafe-inline'` | 인라인 스타일 호환 위해 허용, 잔여 위험 기록 | 문서화 |

## 상세

### H-1. 취약한 개발 의존성 (OWASP A03 공급망 실패 / ASVS 5.0 V15)

- 근거: `pnpm audit`에서 높음 2건.
  - `js-yaml` 4.3.1: `GHSA-2883-xcg3-v3hh`(CWE-400/407), `>=4.0.0 <4.3.2` 영향.
  - `basic-ftp` 5.3.1: `GHSA-c475-qrg2-pj4r`(CWE-1333), `<=6.2.0` 영향.
  - 두 경로 모두 `devDependencies > pm2`의 전이 의존성이며 런타임 번들에는 포함되지 않는다.
- 재현: `worker/tests/dependency-baseline.test.ts`가 lockfile의 `js-yaml >= 4.3.2`와 `basic-ftp` 부재(또는 `>= 6.2.1`)를 검사한다. 수정 전 js-yaml 4.3.1에서 실패했고, 수정 후 통과한다.
- 조치: `pm2`를 7.0.4에서 7.1.1로 갱신했다. 7.1.1은 js-yaml 4.3.2를 쓰고 `basic-ftp` 전이 경로를 제거한다.
- 검증: `pnpm audit --audit-level=low` → `No known vulnerabilities found`.
- 잔여 위험: 레지스트리 권고 DB 기반 탐지라 악성 패키지·미공개 취약점은 잡지 못한다. lockfile은 커밋되어 재현 가능하다.

### M-1. 보안 헤더·CSP 부재 (OWASP A02 보안 설정 오류 / ASVS 5.0 V3·V13)

- 근거: Worker API, Node 서버, 정적 자산 어디에도 CSP·HSTS·`X-Content-Type-Options`·`Referrer-Policy`·`frame-ancestors`가 없었다.
- 조치:
  - `shared/domain/security-headers.ts`에 단일 헤더 집합을 두고 Worker(`worker/ui/security-headers.ts`)와 Node(`src/ui/security-headers.ts`) 미들웨어가 모든 응답에 적용한다.
  - Cloudflare 정적 자산은 Worker를 거치지 않으므로 `web/public/_headers`에 같은 값을 두고, Vite가 `dist/client/_headers`로 복사한다.
  - CSP: `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'`
  - 추가: HSTS(1년, includeSubDomains), `nosniff`, `DENY`, `strict-origin-when-cross-origin`, `Permissions-Policy`, COOP/CORP `same-origin`.
- 검증:
  - `worker/tests/security-headers.test.ts`: Worker 응답의 모든 헤더와 정적 `_headers` 동기화, `script-src`에 `unsafe-inline` 부재를 검사한다.
  - `src/ui/security-headers.test.ts`: Node 앱 응답 헤더를 검사한다.
  - 빌드 산출물 `dist/client/index.html`에는 인라인 `<script>`/`<style>`이 없고 외부 번들만 참조한다. 따라서 `script-src 'self'`와 호환된다.
- 잔여 위험: React 인라인 `style` 속성과 Mermaid SVG 스타일 때문에 `style-src 'unsafe-inline'`을 허용했다. 스타일 기반 데이터 유출 면은 남는다. 브라우저 e2e로 CSP 위반 리포트를 수집하지는 않았으므로 배포 후 위반 로그 확인이 필요하다.

### M-2. 의존성·비밀 이력 CI 점검 부재 (OWASP A03·A08 / ASVS 5.0 V1·V15)

- 근거: 기존 워크플로는 `main` PR의 소스 브랜치만 검사했고, 의존성 취약점·비밀 유출·이력 스캔 게이트가 없었다.
- 조치: `.github/workflows/security.yml` 추가.
  - `dependency-audit`: `pnpm install --frozen-lockfile` 후 `pnpm audit --audit-level=high`.
  - `secret-scan`: 전체 이력(`fetch-depth: 0`)에 `node scripts/security/scan-secrets.mjs` 실행.
  - 트리거: `dev`/`main` push·PR, 매주 월요일 03:00 UTC.
  - 외부 Action은 최신 릴리스(`actions/checkout@v7.0.1`, `actions/setup-node@v7.1.0`, `pnpm/action-setup@v6.1.0`)로 고정했다.
- 스캐너: GitHub/AWS/PASETO/Slack 토큰, PEM 개인키 본문, tailnet 호스트명, 비밀번호 리터럴을 탐지한다. GATED 패턴이 하나라도 있으면 종료 코드 1로 실패하며, 값은 출력하지 않고 패턴·파일·건수만 출력한다.
- 검증: 전체 이력 스캔, GATED 0건, 정보성 6건(테스트 비밀번호 2, tailnet 호스트명 4).
- 잔여 위험: 정규식 기반 고신호 탐지라 임의 고엔트로피 문자열·난독화된 비밀은 놓칠 수 있다. 필요 시 gitleaks/trufflehog 도입을 후속으로 둔다.

### L-1. git 이력의 tailnet 호스트명

- 근거: 과거 `wrangler.jsonc` 커밋에 실제 tailnet 호스트명 1건이 남아 있고, 문서에는 `<device>.<tailnet>.ts.net` 형태의 자리표시자가 있다. 현재 `wrangler.jsonc`에는 없다.
- 판단: 호스트명은 자격 증명이 아니며 tailnet 외부에서 해석되지 않는다. 이력 재작성은 기존 클론·서명·배포 참조를 깨뜨리므로 하지 않았다.
- 잔여 위험: 저장소 읽기 권한자가 내부 호스트 이름을 알 수 있다. 낮음.

### L-2. 테스트의 비밀번호 리터럴

- 근거: `worker/tests/helpers.ts`, `worker/tests/pin-separation.test.ts`에 테스트용 비밀번호 문자열이 있다.
- 판단: 실제 자격 증명이 아닌 고정 테스트 입력이며, 값은 문서·보고서에 출력하지 않았다. 스캐너는 정보성으로만 표시한다.
- 잔여 위험: 테스트 값 재사용 습관이 실제 비밀과 섞일 수 있으므로 CI GATED 패턴에 실제 토큰 형식을 유지한다.

### L-3. 로컬 `.env` 권한

- 근거: `/Users/young-mini/Factory/.env`가 644였다(저장소 외부, `.gitignore` 대상).
- 조치: 600으로 제한했다. 저장소의 `~/.local/state/biseo`는 이미 700이다.
- 잔여 위험: 로컬 백업·동기화 도구가 별도 사본을 만들 수 있다. 저장소 밖 운영 절차로 관리한다.

### L-4. 프런트 XSS·마크다운 렌더링

- 근거: `react-markdown`은 `skipHtml`과 `urlTransform={safeUrl}`로 원시 HTML과 위험 스킴을 차단한다. 링크는 `rel="noopener noreferrer"`를 쓰고 이미지는 렌더링하지 않는다. Mermaid 출력은 DOMPurify(svg 프로필) 후 `sanitizeSvg`로 script·이벤트 핸들러·외부 href를 제거한다.
- 조치: `web/ui/markdownLinkSafety.test.ts` 추가. `javascript:` 링크의 `href` 제거와 `noopener` 유지, 정상 https 링크 보존을 검사한다.
- 잔여 위험: SVG 새니타이저는 정규식 보조 계층이라 DOMPurify 설정 변경에 민감하다. CSP `script-src 'self'`가 2차 방어선이다.

### L-5. 공급망·자산 관리

- Pretendard는 npm 패키지로 자체 호스팅하며 외부 CDN·SRI 대상이 없다.
- 런타임 의존성은 lockfile로 고정되고, 일부 패키지는 정확한 버전(`react-router`, `zod`, `zustand`, `@tanstack/react-query`, `pretendard`)으로 고정되어 있다.
- 잔여 위험: 다수 의존성이 caret 범위를 쓰므로 `pnpm install` 시 lockfile을 갱신하지 않는 한 고정된다. CI는 `--frozen-lockfile`을 사용한다.

## 검증 명령

```bash
pnpm audit --audit-level=low
node scripts/security/scan-secrets.mjs
pnpm test
pnpm typecheck
pnpm build
```

- `pnpm test`: 822개 통과, 실패 0.
- `pnpm typecheck`: 통과.
- `pnpm build`: 통과(기존 Vite chunk-size 경고만 존재). `dist/client/_headers` 생성 확인.
- 커밋: `security/043-platform`에만 기록하며 push·병합·배포하지 않는다.
