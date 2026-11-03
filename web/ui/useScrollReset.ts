import { useCallback, useRef } from 'react'
import type { TimelineItem } from '../domain/timeline'
import type { useRecentPull } from './useRecentPull'
import { runScrollReset } from './scrollReset'

type Pull = ReturnType<typeof useRecentPull>

export function useScrollReset(
  items: TimelineItem[],
  onCancel: ((id: string) => void | Promise<void>) | undefined,
  pull: Pull,
) {
  const busy = useRef(false)
  return useCallback(() => {
    if (!onCancel || pull.isPending) return
    void runScrollReset(items, {
      cancel: (id) => onCancel(id),
      pull: () => pull.mutateAsync(),
    }, busy)
  }, [items, onCancel, pull])
}
