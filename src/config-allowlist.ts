import { normalizeInterruptKey } from './domain/interrupt-key.js'

export function validInterruptAllowlist(value: unknown): value is Record<string, string[]> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  const entries = Object.entries(value)
  if (!entries.some(([agent]) => agent === 'default')) return false
  for (const [agent, keys] of entries) {
    if (!agent || agent !== agent.toLowerCase() || !Array.isArray(keys)) return false
    for (const key of keys) {
      const k = normalizeInterruptKey(key)
      if (!k || k !== key) return false
      if (agent === 'opencode' && k === 'ctrl+c') return false
    }
    if (agent === 'default' && keys.some((key) => key !== 'esc')) return false
  }
  return true
}
