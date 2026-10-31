import r from '../resources.json'

const res = r as Record<string, string | undefined>

export const COLLAPSED_PANES_MIN = Number(res.collapsedPanesMin ?? '1')
export const COLLAPSED_PANES_MAX = Number(res.collapsedPanesMax ?? '3')
export const COLLAPSED_PANES_DEFAULT = Number(res.collapsedPanesDefault ?? '3')

function toInt(raw: unknown): number | null {
  if (typeof raw === 'number' && Number.isInteger(raw)) return raw
  if (typeof raw === 'string' && raw.trim() !== '') {
    const n = Number(raw.trim())
    if (Number.isInteger(n)) return n
  }
  return null
}

export function clampCollapsedCount(
  raw: unknown,
  min = COLLAPSED_PANES_MIN,
  max = COLLAPSED_PANES_MAX,
  fallback = COLLAPSED_PANES_DEFAULT,
): number {
  const n = toInt(raw)
  if (n === null) return fallback
  return Math.min(max, Math.max(min, n))
}

export function selectCollapsedPanes<T>(
  ordered: readonly T[],
  count: number,
): T[] {
  return ordered.slice(0, Math.max(0, Math.trunc(count) || 0))
}
