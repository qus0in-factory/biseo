import { useEffect, useState } from 'react'

const KEY = 'biseo:left-drawer-open'

export function usePaneDrawer() {
  const [open, setOpen] = useState(() => {
    if (typeof window === 'undefined') return true
    try { return window.localStorage.getItem(KEY) !== '0' } catch { return true }
  })
  useEffect(() => {
    try { window.localStorage.setItem(KEY, open ? '1' : '0') } catch {}
  }, [open])
  return { open, toggle: () => setOpen((v) => !v) }
}
