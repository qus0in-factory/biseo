export const INTERRUPT_KEYS = ['esc', 'ctrl+c'] as const
export type InterruptKey = (typeof INTERRUPT_KEYS)[number]

export function normalizeInterruptKey(value: unknown): InterruptKey | null {
  if (typeof value !== 'string') return null
  const k = value.trim().toLowerCase().replace(/\s+/g, '')
  if (k === 'escape') return 'esc'
  return (INTERRUPT_KEYS as readonly string[]).includes(k) ? (k as InterruptKey) : null
}

export function interruptAllowed(
  agent: string | null,
  key: InterruptKey,
  allowlist?: Record<string, string[]>,
): boolean {
  const kind = (agent ?? '').toLowerCase()
  if (kind === 'opencode' && key === 'ctrl+c') return false
  const list = allowlist?.[kind] ?? allowlist?.default ?? ['esc']
  return list.includes(key)
}
