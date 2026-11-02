import { useEffect, useRef } from 'react'

export function useUsageInterval(enabled: boolean, load: () => Promise<void>) {
  const live = useRef(true)
  useEffect(() => {
    live.current = true
    return () => {
      live.current = false
    }
  }, [])
  useEffect(() => {
    if (!enabled) return
    void load()
    const t = setInterval(() => void load(), 60000)
    return () => clearInterval(t)
  }, [enabled, load])
  return live
}
