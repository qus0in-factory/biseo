# 0.3.x 단계별 진행

[부모 #19](https://github.com/qus0in-factory/biseo/issues/19). 이슈·마일스톤 게시와 교차 검토 후 0.3.0 구현 배정 완료.

| 버전 | 범위 |
| --- | --- |
| 0.3.0 | 지정 workspace 기존 패널 이름·agent·상태, 전송/불가 사유, 하나의 타임라인, REST 접수+SSE 상태/완료 응답 |
| 0.3.1 | D1 영속화·재로그인 복원·과거 스크롤·리터럴 검색 |
| 0.3.2 | DESIGN.md·요청 프런트 스택 전체·반응형 메뉴·제목·컴포넌트·트랜지션 정교화 |

0.3.0에서도 기존 cookie/PASETO·CSRF/Origin·XSS·지정 workspace 제한·비밀 미노출을 지킨다. SSE 필수, polling 금지. REST 조회는 초기 로드/명시적 재접속 복구용. terminal snapshot을 순수 답변으로 대체하지 않는다.

## 분담

- ds-g: #20, src/**. OpenCode Go DeepSeek, 배정 전 off-peak 확인.
- ga: #21, worker/**.
- gf: #22, web/**.
- sol: #23, 공통 계약·shared·package/lockfile·설정·통합/타 계열 리뷰.
- 같은 cwd의 변경은 공유되므로 타 담당 파일을 덮어쓰지 않는다. 충돌 시 dev worktree 가능, dev 통합 후 main PR.
- D1/UI 고도화는 현재 구현 배정에서 제외. 패널 생성·취소·대기열·사용량은 0.4 논의 대상.
- 자동 검사 통과만으로 완료 선언하지 않으며 사용자 만족까지 피드백과 패치를 진행한다.

[DESIGN.md](../DESIGN.md), [연동 계약](contracts-0.3.0.md), [게시 이슈](issues-0.3.0.md)를 함께 읽는다. 후속 버전 조건을 0.3.0 완료 조건으로 혼합하지 않는다.
