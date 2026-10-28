---
audience: user
---
# 개발·승격 흐름

## Why

모든 작업을 dev에서 통합한 뒤 main으로 승격하여 검토 경로를 하나로 유지한다.

## What

- 흐름: 작업 브랜치 → **dev에 먼저 merge** → **dev에서 main으로 PR**.
- dev에서 직접 작업한 변경도 dev에 push한 뒤 main PR로 승격한다.
- 별도 worktree는 허용한다. worktree를 사용해도 dev 통합을 건너뛰지 않는다.
- main 직접 push·강제 push·삭제는 보호 규칙으로 막는다. 관리 계정에도 적용한다.
- main PR은 같은 저장소의 dev에서 온 경우에만 필수 검사 `main-source`를 통과한다.
- 우회 권한을 따로 두지 않으며 미해결 대화와 필수 검사 실패가 있으면 merge하지 않는다.
- 계열이 다른 모델의 결과물 리뷰는 AGENTS.md와 review-deliverables 절차에 따른다. GitHub 승인 수와 모델 리뷰는 별도다.

## How

1. dev의 최신 상태에서 작업 브랜치나 worktree를 만든다.
2. 변경·검증·다른 계열 모델 리뷰 후 dev에 merge한다.
3. dev를 origin에 push하고 base=main, head=dev인 PR을 만든다.
4. `main-source`와 필요한 검증 결과·리뷰를 확인한 뒤 승격한다. PR 생성은 merge 완료를 뜻하지 않는다.
5. main이 바뀌면 다음 작업 전 dev에 변경을 반영한다. dev 브랜치는 계속 유지한다.

현재 협업자는 1명이므로 GitHub 승인 수는 0으로 두고, dev 소스 필수 검사와 PR·모델 리뷰를 유지한다.

현재 0.1.0의 기능 목표는 Hono + pnpm + PM2, 로컬 6543 → Funnel HTTPS 443의 무인증 /health HTTP 200이다. 인증과 추가 API는 다음 단계다.
