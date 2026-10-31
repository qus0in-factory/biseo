import { useEffect, useState } from 'react'
import { clampCollapsedCount, COLLAPSED_PANES_MIN, COLLAPSED_PANES_MAX, COLLAPSED_PANES_DEFAULT } from '../domain/collapsedPanes'
import r from '../resources.json'

const KEY = r.collapsedPanesStorageKey

export function useCollapsedPaneCount() {
  const [count, setCount] = useState(() => {
    if (typeof window === 'undefined') return COLLAPSED_PANES_DEFAULT
    try { return clampCollapsedCount(window.localStorage.getItem(KEY)) } catch { return COLLAPSED_PANES_DEFAULT }
  })
  useEffect(() => { try { window.localStorage.setItem(KEY, String(count)) } catch {} }, [count])
  const decrease = () => setCount((v) => clampCollapsedCount(v - 1))
  const increase = () => setCount((v) => clampCollapsedCount(v + 1))
  return { count, setCount, decrease, increase, canDecrease: count > COLLAPSED_PANES_MIN, canIncrease: count < COLLAPSED_PANES_MAX }
}
