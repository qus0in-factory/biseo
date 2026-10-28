# 0.3.0 준비 검토

- gf=DESIGN.md, ga=계약 작성. sol이 타 계열 리뷰 후 보완 반영.
- ds-g(OpenCode Go DeepSeek, off-peak)=이슈 초안·디자인 스킬 정적 리뷰 통과(보완 반영).
- 공식 CLI 0.4.0 lint: errors 0, warnings 8(본문 사용 토큰 직접 참조 부재). 대비 경고 해결.
- CSS/DTCG export, 공백/- 시작 파일명, skill validator, sh -n 검증 통과. 스크립트 18줄·634자.
- 완료 응답 수집은 구현 전 검증 게이트. 터미널 스냅샷 폴백 금지, 미지원은 capture_unavailable.
- 이슈/마일스톤 미게시. 앱 구현·배포·커밋 미실행.

UI 작업 전 루트 DESIGN.md를 읽는다. 공식 CLI 래퍼는 workspace .agents/skills/maintain-design-md/scripts/design-md.sh. 내보낸 토큰은 임시 파일에서 확인 후 반영한다.

## 이슈 게시·배정 갱신

0.3.0 SSE 최소 PoC #19–23, 0.3.1 D1 #24, 0.3.2 UI #25 분리 게시. gf→ga 보안, ds-g→gf 디자인/peer 교차 리뷰. sol이 Wrangler latest4.154.0으로 교정하고 Workers100초일괄제한 주장은 공식 근거와 달라 채택하지 않음. production audit 알려진취약점0은 전체보안보증이 아님.

compact 후 ds-g=src, ga=worker, gf=web 실제 working 확인. shared/package/설정/통합=sol. 후속patch 구현·배포·git커밋 미실행.
