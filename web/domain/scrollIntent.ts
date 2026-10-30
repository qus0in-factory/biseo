import type { TimelineItem } from './timeline-item'

export type ScrollAction = 'bottom' | 'jump' | 'none'

/** 직전 목록에 없던 본인 전송 항목이 새로 추가됐는지 판별한다. */
export const ownSendAdded = (prev: readonly TimelineItem[], next: readonly TimelineItem[]): boolean => {
  const seen = new Set(prev.map((i) => i.requestId))
  return next.some((i) => i.ownSend === true && !seen.has(i.requestId))
}

/**
 * 스크롤 정책.
 * - bottom: 하단으로 이동한다. 본인 전송은 항상 이기고, 수신 갱신은 하단 유지 중일 때만 이긴다.
 * - jump: 사용자가 위로 읽는 중이라 점프 버튼만 띄운다.
 * - none: 화면을 움직이지 않는다.
 */
export const scrollAction = (ownSend: boolean, following: boolean, changed: boolean): ScrollAction => {
  if (ownSend || following) return 'bottom'
  return changed ? 'jump' : 'none'
}
