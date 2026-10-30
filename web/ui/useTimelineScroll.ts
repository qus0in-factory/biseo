import { useCallback } from 'react'
import type { TimelineItem } from '../domain/timeline'
import { useAutoScroll } from './useAutoScroll'
import { useLoadOlder } from './useLoadOlder'

export function useTimelineScroll(items: TimelineItem[], onLoadOlder?: () => void, olderLoaded = 0) {
  const auto = useAutoScroll(items)
  const load = useLoadOlder(auto.ref, onLoadOlder, olderLoaded)
  const onScroll = useCallback(() => {
    auto.onScroll()
    load()
  }, [auto.onScroll, load])
  return { ...auto, onScroll }
}
