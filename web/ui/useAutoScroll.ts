import { useCallback, useEffect, useRef, useState } from 'react'
import type { TimelineItem } from '../domain/timeline'
import { isNearBottom, scrollDown } from './scrollHelper'
import { planScroll } from './autoScrollPlan'

export function useAutoScroll(items: TimelineItem[]) {
  const ref = useRef<HTMLDivElement>(null)
  const [jump, setJump] = useState(false)
  const prevRef = useRef(items)
  const followRef = useRef(true)
  const lastTopRef = useRef(0)

  const toBottom = useCallback(() => {
    followRef.current = true
    scrollDown(ref.current)
    setJump(false)
  }, [])

  const onScroll = useCallback(() => {
    const el = ref.current
    if (!el) return
    const isNear = isNearBottom(el)
    if (isNear) {
      followRef.current = true
      setJump(false)
    } else if (el.scrollTop < lastTopRef.current - 1) {
      followRef.current = false
    }
    lastTopRef.current = el.scrollTop
  }, [])

  useEffect(() => {
    const act = planScroll(prevRef.current, items, followRef.current)
    prevRef.current = items
    if (act === 'bottom') { toBottom() }
    else if (act === 'jump') setJump(true)
  }, [items, toBottom])

  // 마크다운 지연 렌더 등으로 콘텐츠 높이가 커져도 하단을 유지 중이면 따라간다.
  useEffect(() => {
    const el = ref.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(() => {
      if (followRef.current) scrollDown(el)
    })
    observer.observe(el)
    for (const child of Array.from(el.children)) observer.observe(child)
    return () => observer.disconnect()
  }, [items])

  return { ref, showJump: jump, scrollToBottom: toBottom, onScroll }
}
