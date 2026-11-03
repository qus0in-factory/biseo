import { useCallback, useEffect, useRef, useState } from 'react'
import type { TimelineItem } from '../domain/timeline'
import { scrollDown } from './scrollHelper'
import { planScroll } from './autoScrollPlan'
import { useBottomReached } from './useBottomReached'

export function useAutoScroll(items: TimelineItem[], onReach?: () => void) {
  const ref = useRef<HTMLDivElement>(null)
  const [near, setNear] = useState(true)
  const [jump, setJump] = useState(false)
  const prevRef = useRef(items)
  const g = useBottomReached(ref, onReach)

  const toBottom = useCallback(() => {
    g.begin()
    scrollDown(ref.current)
    setJump(false)
  }, [g])

  const onScroll = useCallback(() => {
    const isNear = g.check()
    setNear(isNear)
    if (isNear) setJump(false)
  }, [g])

  useEffect(() => {
    const act = planScroll(prevRef.current, items, near)
    prevRef.current = items
    if (act === 'bottom') { toBottom(); setNear(true) }
    else if (act === 'jump') setJump(true)
  }, [items, near, toBottom])

  return {
    ref,
    showJump: jump,
    scrollToBottom: toBottom,
    onScroll,
    onUserScroll: g.handlers,
  }
}
