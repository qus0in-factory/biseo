import { useRef } from 'react'
import type { TimelineItem as T } from '../domain/timeline'
import { createRecoveryRefs } from './recoveryRefs'

export function useSyncRefs(items: T[], update: (i: T) => void, workspace: string | null) {
  const ref = useRef(createRecoveryRefs())
  ref.current.refresh(items, update, workspace)
  return ref.current
}
