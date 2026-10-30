import { useCallback, useEffect, useRef, useState } from 'react'
import type { TimelineItem } from '../domain/timeline'
import { isNearBottom, scrollDown, itemsKey } from './scrollHelper'

export function useAutoScroll(items: TimelineItem[]) {
  const ref = useRef<HTMLDivElement>(null)
  const [near, setNear] = useState(true)
  const [jump, setJump] = useState(false)
  const keyRef = useRef(itemsKey(items))

  const toBottom = useCallback(() => {
    if (ref.current) scrollDown(ref.current)
    setJump(false)
  }, [])

  const onScroll = useCallback(() => {
    if (!ref.current) return
    const isNear = isNearBottom(ref.current)
    setNear(isNear)
    if (isNear) setJump(false)
  }, [])

  useEffect(() => {
    const k = itemsKey(items)
    if (near) {
      toBottom()
    } else if (k !== keyRef.current) {
      setJump(true)
    }
    keyRef.current = k
  }, [items, near, toBottom])

  return { ref, showJump: jump, scrollToBottom: toBottom, onScroll }
}
