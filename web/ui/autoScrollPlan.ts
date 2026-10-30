import type { TimelineItem } from '../domain/timeline'
import { ownSendAdded, scrollAction, type ScrollAction } from '../domain/scrollIntent'
import { itemsKey } from './scrollHelper'

/**
 * 직전 목록과 새 목록을 비교해 스크롤 동작을 정한다.
 * - bottom: 하단으로 이동(본인 전송은 항상, 수신 갱신은 하단 유지 중일 때)
 * - jump: 점프 버튼만 띄움(위로 읽는 중이라 강제 이동하지 않음)
 * - none: 화면을 움직이지 않음
 */
export const planScroll = (
  prev: readonly TimelineItem[],
  next: readonly TimelineItem[],
  following: boolean,
): ScrollAction =>
  scrollAction(ownSendAdded(prev, next), following, itemsKey(prev) !== itemsKey(next))
