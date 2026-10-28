# biseo 저장소 운영 기록

## Why

프로젝트 시작 상태와 원격 운영 결정을 기록하여 다른 워커가 같은 초기화를 반복하지 않게 한다.

## What

2026-10-28 확인 기준:

- 초기 폴더에는 빈 `README.md`와 빈 `docs/`만 있었으며 코드와 프로젝트별 지침은 없었다.
- `biseo/`를 독립 Git 저장소로 초기화했다. 상위 워크스페이스는 별도 Git 저장소로 초기화하지 않았다.
- [qus0in-factory/biseo](https://github.com/qus0in-factory/biseo)를 **public**으로 생성했다.
- `origin`은 `https://github.com/qus0in-factory/biseo.git`, 브랜치는 `main`이다.
- 초기 커밋 [`666ce77`](https://github.com/qus0in-factory/biseo/commit/666ce77)은 빈 README.md를 포함하며 origin/main으로 푸시했다.
- 사용자의 요청으로 기본 라벨 `accessibility`, `bug`, `documentation`, `duplicate`, `enhancement`, `good first issue`, `help wanted`, `invalid`, `question`, `wontfix`를 삭제했고 당시 잔여 라벨은 0개였다. 새 라벨은 별도 요청에 따라 관리한다.
- 초기 Funnel·인증 작업은 계획 작성이었으나 사용자 정정 후 무인증 0.1.0 health를 실제 구현·공개하고 HTTP 200을 확인했다. 인증은 다음 단계이며 현재 상태는 operations.md를 따른다.

## How

변경 전 `git status`, `git remote -v`와 GitHub 상태를 재조회한다. 공개 문서와 이슈에는 비밀 값·실제 운영 접속 정보·개인 세션 식별자를 기록하지 않는다. 커밋 전 상위 AGENTS.md에 따라 `.gitignore`와 스테이징 파일을 검토한다.

범용 운영 방법은 워크스페이스의 `manage-github-repositories` 스킬, 현재 서비스 계획은 `auth/funnel-auth-plan.md`, 검증 조건은 `exposure/healthcheck-acceptance.md`를 따른다.
