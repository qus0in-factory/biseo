import { useEffect, useState } from 'react'
import { usageVisibleFromStorage } from '../domain/usageVisibility'

const KEY = 'biseo:usage-visible'

export function useUsageVisibility() {
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return true
    try { return usageVisibleFromStorage(window.localStorage.getItem(KEY)) } catch { return true }
  })
  useEffect(() => {
    try { window.localStorage.setItem(KEY, visible ? '1' : '0') } catch {}
  }, [visible])
  return { visible, toggle: () => setVisible((v) => !v) }
}
