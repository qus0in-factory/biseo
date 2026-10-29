# 게시된 0.3.x 이슈

2026-10-28 게시. 부모 [#19](https://github.com/qus0in-factory/biseo/issues/19). 각 이슈에는 평면 책임 라벨 하나를 붙였다. 우선도/영향도는 본문 필드다.

| 이슈 | 버전 | 담당/라벨 |
| --- | --- | --- |
| [#20 Herdr 어댑터·완료응답](https://github.com/qus0in-factory/biseo/issues/20) | 0.3.0 | ds-g / service |
| [#21 REST·SSE](https://github.com/qus0in-factory/biseo/issues/21) | 0.3.0 | ga / service |
| [#22 최소 웹](https://github.com/qus0in-factory/biseo/issues/22) | 0.3.0 | gf / interface |
| [#23 통합·보안 검증](https://github.com/qus0in-factory/biseo/issues/23) | 0.3.0 | sol / validation |
| [#24 D1 이력·스크롤·검색](https://github.com/qus0in-factory/biseo/issues/24) | 0.3.1 | 미착수 / storage |
| [#25 디자인·프런트 고도화](https://github.com/qus0in-factory/biseo/issues/25) | 0.3.2 | 미착수 / interface |

0.3.0 선행 순서: #20 응답수집/이벤트 계약 → #21/#22 통합 → #23 실제 검증. 독립 구현은 파일 경계로 분담했다. #24/#25는 0.3.0 부모의 완료 체크리스트에 넣지 않았다.

gf가 ga의 보안/계약을, ds-g가 gf의 UI/버전 호환을 리뷰하고 sol이 공식 근거와 대조했다. SSE 필수/polling 금지, 기존 인증·새 경로 보안·응답수집 검증은 0.3.0에도 유지한다. 사용자 요청에 따라 patch 마일스톤으로 기능을 단계 분리했다.
