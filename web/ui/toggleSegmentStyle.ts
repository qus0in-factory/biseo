// 선택된 토글 조각 강조: 마크다운/원본·남은한도/사용량 토글이 공유한다.
export const toggleSegmentStyle = (on: boolean): string =>
  on ? 'bg-primary text-primary-foreground' : 'bg-transparent text-muted-foreground'
