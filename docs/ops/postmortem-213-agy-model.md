---
audience: internal
---

# #213 AGY 모델 표시 누락 부검

<!-- issue-kind: postmortem; issue-format: time -->

## Trigger

[#213](https://github.com/qus0in-factory/biseo/issues/213)에서 gf의 모델 행이 비었다. 당시 AGY의 실제 화면에는 `Gemini 3.8 Flash · low`가 있었지만 수집 소스 `recent-unwrapped` 최근 8줄은 비어 있었다. 관측한 세션의 문제이며 모든 AGY 세션으로 일반화하지 않는다.

별도로 조율자는 첫 대화 후 세션 ID가 생긴 사실만으로 biseo 인식까지 해결됐다고 판단했다. 세션 생성과 서버 수집·UI 표시는 다른 검증 경계다.

## Idea

기존 파서는 화면 상태줄을 읽을 수 있었다. 모델 이름이나 gf 별칭을 하드코딩하지 않고, `pane-model-observe.ts`에서 AGY만 `visible`, OpenCode는 기존 `recent-unwrapped`를 사용하도록 한 줄 분기했다.

## Manual

1. 실제 상태줄, collector의 수집 소스, 관측 결과를 대조한다. 세션 ID 존재만으로 UI 성공을 선언하지 않는다.
2. 최소 수정·관련 검사·전체 검사·타입·빌드와 타계열 검토를 확인한다. 새 테스트나 의존성은 요청 없이 추가하지 않는다.
3. dev push·정확 커밋 CI 후 현재 PM2 경로·진행 중 작업·설정 보존 대상을 확인한다.
4. 검증된 산출물을 반영하고 대상 앱만 재시작한다. 인증 응답·실행 API의 모델 정보를 다시 읽고 수정 전후의 증거와 한계를 구분한다.

## Evaluation

- 수정 `757f1a8b21a60c2a9f56c4a61132ece2bd20ff23`, [CI 41758815193](https://github.com/qus0in-factory/biseo/actions/runs/41758815193) 성공. 관련 13개·전체 984개 검사와 타입·빌드가 통과했다. 기존 청크 크기 경고는 남았다.
- 작성 Terra(OpenAI, low), 검토 DeepSeek(max, 정책 예외)의 타계열 읽기 전용 리뷰는 approve, P0/P1 0이었다.
- 2026-11-04 실행 서버 산출물 374개를 비교해 변경이 관측 모듈 1개뿐임을 확인했다. 기존 모듈을 백업·원자 교체하고 PM2 `biseo`만 재시작했다. PID 4099→24151, online, cwd·스크립트·운영 설정 유지, 새 오류 로그 0을 확인했다.
- 무인증 health 401, 보호된 서비스 토큰 요청 200, 패널 API 200과 gf의 `gemini-3.8-flash` / `agy`를 확인했다. 키·토큰 값은 기록하지 않았다.
- readback 시점에는 recent 기록에도 상태줄이 있어 API 성공만으로 수정 효과를 구분할 수 없었다. AGY가 visible을 선택하는 실제 함수 호출과 앞선 빈 기록 표본이 코드 경로 근거다. 로그인 후 UI를 새로 촬영한 것은 아니다.
- 한시적 artifact 배포이므로 옛 release 소스로 다시 빌드하면 수정이 덮인다. 후속 배포는 수정이 포함된 main을 기준으로 한다. 상태줄이 사라지거나 줄바꿈되면 관측이 실패할 수 있다.

원시 근거는 내부 보고 `/tmp/herdr-report-ter-biseo-213-ready.md`, `/tmp/herdr-report-ds-biseo-213-review.md`, `/tmp/herdr-report-ds-biseo-213-deployed.md`에 남겼다. 임시 경로의 영구 보관을 전제하지 않고 핵심 관측·판정·조치는 이 문서에 보존한다.
