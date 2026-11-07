import { useEffect, useRef, useState } from 'react'
import config from '../usage-config.json'

export function useUsageRefresh(retry: () => Promise<void>) {
  const [busy, setBusy] = useState(false)
  const [pending, setPending] = useState(false)
  const locked = useRef(false)
  const live = useRef(true)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => {
    live.current = true
    return () => { live.current = false; clearTimeout(timer.current) }
  }, [])
  const refresh = async () => {
    if (locked.current) return
    locked.current = true
    setBusy(true)
    setPending(true)
    try { await retry() } finally {
      if (live.current) {
        setPending(false)
        timer.current = setTimeout(() => {
          locked.current = false
          setBusy(false)
        }, config.refreshCooldownMs)
      }
    }
  }
  return { busy, pending, refresh }
}
