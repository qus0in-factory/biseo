import { useCallback, useEffect, useRef, useState } from 'react'
import type { TimelineItem } from '../domain/timeline'
import { isNearBottom, scrollDown } from './scrollHelper'
import { planScroll } from './autoScrollPlan'

export function useAutoScroll(items: TimelineItem[]) {
  const ref = useRef<HTMLDivElement>(null)
  const [near, setNear] = useState(true)
  const [jump, setJump] = useState(false)
  const prevRef = useRef(items)

  const toBottom = useCallback(() => {
    scrollDown(ref.current)
    setJump(false)
  }, [])

  const onScroll = useCallback(() => {
    const isNear = isNearBottom(ref.current)
    setNear(isNear)
    if (isNear) setJump(false)
  }, [])

  useEffect(() => {
    const act = planScroll(prevRef.current, items, near)
    prevRef.current = items
    if (act === 'bottom') { toBottom(); setNear(true) }
    else if (act === 'jump') setJump(true)
  }, [items, near, toBottom])

  return { ref, showJump: jump, scrollToBottom: toBottom, onScroll }
}
