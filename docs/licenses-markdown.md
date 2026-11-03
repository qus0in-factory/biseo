# 외부 마크다운 플러그인 라이선스 (0.5.1)

## `remark-cjk-friendly` 2.3.3

- 라이선스: MIT
- 저장소: https://github.com/tats-u/markdown-cjk-friendly
- 용도: CommonMark의 flanking 규칙 때문에 한글·중국어·일본어 문장부호 옆 `**`가 강조로 인식되지 않는 문제를 보정한다.
- 가져오는 경로: `remark-cjk-friendly/parseOnly` (클라이언트는 Markdown을 HTML로 읽기만 하므로 직렬화 확장은 번들하지 않는다)
- 배치: `remark-gfm` 뒤, `remark-cjk-friendly-gfm-strikethrough` 앞. 공식 README의 `remarkPlugins` 예시 순서를 따른다.
- 호환: ESM 전용, `unified` ^11·`@types/mdast` ^4 peer. `react-markdown` 10.1.0·`remark-gfm` 4.0.1과 함께 동작을 확인했다.
- 배포: 패키지를 빌드 시 번들하며 외부 CDN을 호출하지 않는다.

## `remark-cjk-friendly-gfm-strikethrough` 2.3.2

- 라이선스: MIT
- 저장소: https://github.com/tats-u/markdown-cjk-friendly
- 용도: GFM 취소선 `~~`에도 같은 CJK flanking 보정을 적용한다. `remark-cjk-friendly` 단독으로는 `~~`를 다루지 않는다.
- 가져오는 경로: `remark-cjk-friendly-gfm-strikethrough/parseOnly`
- 배치: 반드시 `remark-gfm` 뒤. 공식 README는 이 플러그인이 `remark-gfm`보다 앞에 있으면 동작하지 않는다고 명시한다.
- 호환: ESM 전용, `unified` ^11·`@types/mdast` ^4 peer.
- 배포: 패키지를 빌드 시 번들하며 외부 CDN을 호출하지 않는다.
