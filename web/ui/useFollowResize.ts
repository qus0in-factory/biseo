import { useEffect } from 'react'
import type { TimelineItem } from '../domain/timeline'
import { scrollDown } from './scrollHelper'

/** 하단을 유지 중일 때 마크다운 지연 렌더 등으로 높이가 커지면 따라간다. */
export function useFollowResize(
  ref: React.RefObject<HTMLDivElement | null>,
  followRef: React.RefObject<boolean>,
  items: TimelineItem[],
) {
  useEffect(() => {
    const el = ref.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(() => {
      if (followRef.current) scrollDown(el)
    })
    observer.observe(el)
    for (const child of Array.from(el.children)) observer.observe(child)
    return () => observer.disconnect()
  }, [ref, followRef, items])
}
