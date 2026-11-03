const strings = (v: unknown): string[] =>
  Array.isArray(v) ? [...new Set(v.filter((x): x is string => typeof x === 'string'))] : []

export const parseUsageHidden = (raw: string | null): string[] => {
  if (!raw) return []
  try { return strings(JSON.parse(raw)) } catch { return [] }
}

export const serializeUsageHidden = (ids: string[]): string => JSON.stringify(ids)

export const toggleUsageHidden = (ids: string[], id: string): string[] =>
  ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]
