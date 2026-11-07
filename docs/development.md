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

현재 릴리스 준비 기준은 [v0.6.6](release/0.6.6-notes.md)다. 배포·복구 기록은 [운영 문서](operations-0.4.0.md)를 참고한다.

## 테스트 규칙 (#210)

- 모듈당 `<module>.test.ts`를 기본으로 한다. 검증 경계가 다를 때만 `<module>.<concern>.test.ts`로 분리한다(React 테스트는 `.test.tsx`).
- fixture·공통 테스트 도구는 `<layer>/test-util/`에 두고 `*.test.*` 이름을 사용하지 않는다.
- 테스트는 `process.cwd()`가 가리키는 실제 운영 설정 경로에 쓰지 않는다. `config/workspace-selection.json`처럼 import 시 기본 경로가 정해지는 모듈은 앱을 동적으로 import하기 전에 임시 cwd/config를 준비한다. 임시 파일에 기록됐는지와 실제 선택 파일의 실행 전후 바이트가 같은지 확인한다. 예시는 `src/ui/test-util/workspace-sandbox.ts`와 [#222](https://github.com/qus0in-factory/biseo/issues/222)다.
- 테스트 파일은 128줄 이하로 유지하며, 구조 정리 시 기존 케이스·assertion을 보존한다.
- `pnpm test`는 shared 타입 검사 후 shared·worker·src·web의 `.test.ts`·`.test.tsx`를 실행한다. `pnpm typecheck`와 `pnpm build`로 전체 타입·빌드를 검증한다.
- v0.5.4 릴리스 결과는 984/984 테스트·27 suites, 실패·취소·skip·todo 0이다. 실행 테스트 수 감소 중 6건은 케이스 삭제가 아니라 테스트 탐색에서 제외한 빈 fixture 파일이다.
- v0.6.0 릴리스 결과는 1012/1012 테스트, 실패 0이다.
- v0.6.1 릴리스 결과는 1019/1019 테스트, 실패 0이다.
