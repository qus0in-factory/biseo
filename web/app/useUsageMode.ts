import { useEffect, useState } from 'react'

const KEY = 'biseo:usage-show-remaining'

export function useUsageMode() {
  const [remaining, setRemaining] = useState(() => {
    if (typeof window === 'undefined') return true
    try { return window.localStorage.getItem(KEY) !== '0' } catch { return true }
  })
  useEffect(() => {
    try { window.localStorage.setItem(KEY, remaining ? '1' : '0') } catch {}
  }, [remaining])
  return { remaining, toggle: () => setRemaining((v) => !v) }
}