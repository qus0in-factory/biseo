import { useEffect, useState } from 'react'
import { defaultUsagePace, parseUsagePace, serializeUsagePace, toggleUsagePace, type UsagePaceKind } from '../domain/usagePace'
import r from '../resources.json'

const KEY = (r as Record<string, string>).usagePaceStorageKey ?? 'biseo:usage-pace'

export function useUsagePace() {
  const [settings, setSettings] = useState(() => {
    if (typeof window === 'undefined') return defaultUsagePace
    try { return parseUsagePace(window.localStorage.getItem(KEY)) } catch { return defaultUsagePace }
  })
  useEffect(() => {
    try { window.localStorage.setItem(KEY, serializeUsagePace(settings)) } catch {}
  }, [settings])
  return { settings, toggle: (kind: UsagePaceKind) => setSettings((prev) => toggleUsagePace(prev, kind)) }
}
