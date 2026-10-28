# 0.3.0 구현·배포 검증

현재 상태: dev push·PR #26·운영 배포 완료. PR은 미병합이며 사용자 만족 확인은 남아 있다.

## 전달 및 범위

- PR: https://github.com/qus0in-factory/biseo/pull/26 (dev → main)
- 서비스: https://biseo.qus0in.workers.dev
- 서버 PM2 biseo: 0.3.0, Node24.22.1, online.
- Worker Version: 11c9a96c-bcb5-40a0-a598-0d2613dfe328.
- 0.3.0: 지정 workspace 기존 패널 현황·REST 전송·SSE 상태/완료 응답·단일 타임라인. polling 없음.
- D1 이력/검색/스크롤은0.3.1(#24), UI 전체 고도화는0.3.2(#25).
- 현재 Claude·Antigravity 구조화 수집 지원. OpenCode·Codex 등 미지원/metadata 없음은 전송 비활성 및 이유 표시. 메모리 대화는 재시작/새 페이지에서 유실될 수 있다.

## 최종 검사

- Node24.22.1에서 typecheck·build·91개 테스트 통과. UI 행동 테스트를 기본 test 명령에 포함.
- Worker deploy --dry-run 번들 통과 후 동일 biseo Worker에 배포.
- 코드 모듈128줄·1024자 제한, 비밀 패턴/ignore 및 공백 검사 통과. 키·비밀번호·D1 신규 생성 없음.
- 격리 Chrome: 메시지·SSE 선도착·중복/상태회귀 방지·렌더 중 연결 유지·패널 삭제/비활성·XSS text 렌더링·모바일 화면 확인. 브라우저/서버/socket/timer는 종료.
- main-source SUCCESS, PR main/dev 및 merge 가능 상태 확인. dev는main 이력을먼저 fast-forward한 후 커밋/push.
- 서버·UI·Worker 타입/테스트/실제 읽기 검증과 단순 문서·공백 정리 검증을 구분했다.

## 실제 질의와 파서 보정

사용자 승인으로 son에 “1+1은 무엇인가요?”를 정확히1회 전송했고 실제 답변은 “1+1은 **2**입니다.”였다. 최초 SSE 결과는 capture_unavailable였으며, 실제 USER_INPUT의 USER_REQUEST/ADDITIONAL_METADATA envelope를 파서가 처리하지 못한 것이 원인이었다.

한 겹 envelope 해제 후 질문 전체를 정확히 매칭하도록 수정했다. 실제 승인 기록 재생·다른 질문 거부·중첩 태그 보존·plain 호환을 Red→Green으로 검증했다. 이후 추가 실질의는 전송하지 않았다. 수정 후 새 질문의 live 완료 SSE까지 검증했다고 주장하지 않는다.

ga의 격리 composed 통합 테스트는 Worker cookie→서비스 PASETO→실제 backend createApp 인증/turn→SSE를 검증했다. Herdr prompt는 stub이며 승인 두 레코드의 고정 가상 metadata를 가진 repo-local fixture를 사용한다. 202·completed 응답2·잘못된 서비스키/무인증401·prompt stub1회·polling0회를 확인했다. /tmp 파일에 의존하지 않는다.

## 운영 읽기 경로

sol 실측:
- Worker 페이지200, 미인증 config401, 로컬 무인증 health401.
- 기존 보호 서비스키로 인증한 Funnel health/panes/SSE200, 10개 패널·초기 pane.updated.
- 보호 사용자세션키로30초 세션을메모리에서만발급한 Worker config/panes/SSE200, 10개 패널·초기 pane.updated. 키/토큰/쿠키는출력·저장하지않음.

gf 독립 실측: 페이지200·title Biseo Workspace·정적JS/CSS200, 미인증 config/panes/SSE 모두401.
ga 독립 확인: PM2 online/Node24.22.1, 페이지200/미인증config401/localhealth401, PR열림·미병합/main-source성공, 마일스톤 분리와 단일라벨. 보호키 사용 인증 후200은 제약에 따라 재호출하지 않았으며 sol 실측과 구분한다.

## 리뷰·운영 원칙

ds-g 서버, ga Worker/인증 통합, gf UI 분담. 상호 리뷰와 sol 통합을 수행했다. lock 누수·이벤트 표기·SSE effect 재연결·offline 차단·응답 경합을 보정했다. CLI hyphen 옵션오인 지적은 설치본에서 재현되지 않아 불필요 fallback을 제거했다. 최종 응답 경합은 Sonnet, envelope는 ds-g 리뷰 통과.

effort 점검은 이슈#19 댓글6470898989에 보고했고 사용자가 gf/ga/sol을medium으로 변경한 표시를 확인했다. 사용자확인과피드백패치를완료기준으로유지하며 이슈를조기종료하지않는다. 제 비동기검증작업만회수하고 운영서버·워커는보존한다.
