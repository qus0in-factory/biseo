export function parseInterruptKey(body: unknown): string | null {
  const key = (body as { key?: unknown } | null)?.key
  if (typeof key !== 'string') return null
  const k = key.trim().toLowerCase()
  return /^[a-z+]{1,16}$/.test(k) ? k : null
}
