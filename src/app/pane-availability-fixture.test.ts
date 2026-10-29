import type { Availability } from '../domain/timeline.js'
export { availableClaim, fresh, old, ttl } from '../domain/availability-fixture.test.js'
export const limited: Availability = {
  state: 'limited',
  source: 'codex',
  checkedAt: '2026-10-29T10:00:00.000Z',
  resetsAt: '2026-10-29T11:00:00.000Z',
  reason: 'rate_limit_reached',
  window: 'primary',
}
