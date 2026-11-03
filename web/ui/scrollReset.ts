import type { TimelineItem } from '../domain/timeline'

/** 사용자가 비하단에서 하단으로 전환했고 자동 스크롤이 아닐 때만 리셋한다. */
export const shouldResetScroll = (
  wasAtBottom: boolean,
  isAtBottom: boolean,
  autoScroll: boolean,
): boolean => !wasAtBottom && isAtBottom && !autoScroll

export type ScrollResetDeps = {
  cancel: (id: string) => void | Promise<void>
  pull: () => Promise<{ state?: string }>
}

export type BusyRef = { current: boolean }

/** 예약 턴을 모두 취소한 뒤 최근 응답을 한 번 가져온다. 예약이 없으면 아무것도 하지 않는다. */
export async function runScrollReset(
  items: readonly TimelineItem[],
  deps: ScrollResetDeps,
  busy: BusyRef,
): Promise<boolean> {
  if (busy.current) return false
  const queued = items.filter((i) => i.status === 'queued')
  if (queued.length === 0) return false
  busy.current = true
  try {
    await Promise.all(queued.map(async (i) => { await deps.cancel(i.requestId) }))
    await deps.pull()
    return true
  } catch {
    return false
  } finally {
    busy.current = false
  }
}
