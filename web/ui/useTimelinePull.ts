import { useEffect } from 'react'
import { useRecentPull } from './useRecentPull'

export function useTimelinePull(pane: string, onImported?: () => void) {
  const pull = useRecentPull(pane, onImported)
  useEffect(() => { pull.reset() }, [pane])
  return pull
}
