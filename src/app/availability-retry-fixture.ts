import type { Availability } from '../domain/timeline.js'

export const soon = (ms: number): Availability => ({
  state: 'limited',
  source: 'codex',
  checkedAt: new Date().toISOString(),
  resetsAt: new Date(Date.now() + ms).toISOString(),
  reason: 'rate_limit_reached',
  window: 'primary',
})

export const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))
