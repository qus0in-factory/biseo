import { useCallback, useEffect, useRef } from 'react'
import type { TimelineItem } from '../domain/timeline'
import { scrollDown } from './scrollHelper'
import { planScroll } from './autoScrollPlan'
import { useFollowScroll } from './useFollowScroll'
import { useFollowResize } from './useFollowResize'

export function useAutoScroll(items: TimelineItem[]) {
  const ref = useRef<HTMLDivElement>(null)
  const { followRef, jump, follow, release, onScroll: handleScroll, showJump: markJump } = useFollowScroll()
  const prevRef = useRef(items)

  const toBottom = useCallback(() => {
    follow()
    scrollDown(ref.current)
  }, [follow])

  useEffect(() => {
    const act = planScroll(prevRef.current, items, followRef.current)
    prevRef.current = items
    if (act === 'bottom') toBottom()
    else if (act === 'jump') markJump()
  }, [items, toBottom, markJump, followRef])

  const onScroll = useCallback(() => {
    const el = ref.current
    if (el) handleScroll(el)
  }, [handleScroll])

  useFollowResize(ref, followRef, items)

  return { ref, showJump: jump, scrollToBottom: toBottom, onScroll, releaseFollow: release }
}
