import type { Availability } from '../domain/timeline.js'

export const resetsAt = new Date(Date.now() + 60000).toISOString()

export const limited: Availability = {
  state: 'limited',
  source: 'codex',
  checkedAt: '2026-10-29T10:00:00.000Z',
  resetsAt,
  reason: 'rate_limit_reached',
  window: 'primary',
}
