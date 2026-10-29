import { MAX_PINNED_PANES } from './pinnedPaneLimits.js'

export function parsePinnedPanes(raw: string | null): string[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return [...new Set(parsed.filter((v): v is string => typeof v === 'string'))].slice(0, MAX_PINNED_PANES)
  } catch {
    return []
  }
}

export function serializePinnedPanes(ids: string[]): string {
  return JSON.stringify(ids)
}
