import type { Availability } from '../domain/timeline.js'
import { createApp } from './app.js'
import type { makeDeps } from '../app/turn-fixture.test.js'

export const resetsAt = new Date(Date.now() + 60000).toISOString()

export const limitedAvailability = {
  get: async (): Promise<Availability> => ({
    state: 'limited',
    source: 'codex',
    checkedAt: new Date().toISOString(),
    resetsAt,
    reason: 'rate_limit_reached',
    window: 'primary',
  }),
}

export const appWith = (d: ReturnType<typeof makeDeps>) =>
  createApp({
    ...d,
    verify: async () => {},
    healthStatus: 'ok',
    timeoutMs: 1000,
    graceMs: 0,
  })
