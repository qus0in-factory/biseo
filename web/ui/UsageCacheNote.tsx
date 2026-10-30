import type { UsageProvider } from '../domain/usage'
import { cacheNote } from '../domain/usage-cache'
import r from '../resources.json'

export function UsageCacheNote({ provider }: { provider: UsageProvider }) {
  const n = cacheNote(provider, r as Record<string, string>)
  if (!n) return null
  return <span className="text-xs text-muted-foreground">{n}</span>
}
