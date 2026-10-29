import { useRef } from 'react'
import type { TimelineItem as T } from '../domain/timeline'

export function useSyncRefs(items: T[], update: (i: T) => void) {
  const iRef = useRef(items)
  iRef.current = items
  const uRef = useRef(update)
  uRef.current = update
  return {
    getItems: () => iRef.current,
    getUpdate: () => (i: T) => uRef.current(i),
  }
}
