import { useEffect, useState } from 'react'
import { parseUsageHidden, serializeUsageHidden, toggleUsageHidden } from '../domain/usageHidden'
import r from '../resources.json'

const KEY = (r as Record<string, string>).usageHiddenStorageKey ?? 'biseo:usage-provider-hidden'

export function useUsageHidden() {
  const [hidden, setHidden] = useState<string[]>(() => {
    if (typeof window === 'undefined') return []
    try { return parseUsageHidden(window.localStorage.getItem(KEY)) } catch { return [] }
  })
  useEffect(() => {
    try { window.localStorage.setItem(KEY, serializeUsageHidden(hidden)) } catch {}
  }, [hidden])
  return {
    hidden,
    toggle: (id: string) => setHidden((prev) => toggleUsageHidden(prev, id)),
    showAll: () => setHidden([]),
  }
}
