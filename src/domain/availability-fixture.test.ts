import type { RateLimits } from './availability.js'
import { unknownAvailability } from './availability.js'
import { codexAvailability } from './codex-availability.js'
export const now = new Date('2026-10-29T10:00:00.000Z')
export const future = '2026-10-29T11:00:00.000Z'
export const fresh = '2026-10-29T09:58:00.000Z'
export const old = '2026-10-29T09:00:00.000Z'
export const ttl = 15 * 60 * 1000
export const limits = (
  reached: string | null,
  snapshotAt: string | null,
  resets: string | null = future,
) => ({ reached, primary: resets, secondary: resets, snapshotAt })
export const codexAt = (r: RateLimits | null) => codexAvailability(r, now, ttl)
export const availableClaim = (checkedAt: string | null) => ({
  ...unknownAvailability(now),
  state: 'available' as const,
  source: 'codex',
  checkedAt,
})
