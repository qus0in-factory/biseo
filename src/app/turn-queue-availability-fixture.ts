import type { Availability } from '../domain/timeline.js'
import { makeItem } from './turn-item.js'
import { input, agent, pane } from './turn-data-fixture.js'
import type { makeDeps } from './turn-fixture.js'

export const limited: Availability = {
  state: 'limited',
  source: 'codex',
  checkedAt: new Date().toISOString(),
  resetsAt: new Date(Date.now() + 60000).toISOString(),
  reason: 'rate_limit_reached',
  window: 'primary',
}
export const idle: Availability = {
  ...limited,
  state: 'unknown',
  resetsAt: null,
  reason: null,
  window: null,
  source: null,
}
export const near = (ms: number): Availability => ({
  ...limited,
  resetsAt: new Date(Date.now() + ms).toISOString(),
})
export function queue(d: ReturnType<typeof makeDeps>) {
  const i = makeItem(input, { pane, agent }, d.store.next())
  d.store.add(i)
  d.queue.add(i)
}
export const wait = async (f: () => boolean) => {
  for (let n = 0; n < 100 && !f(); n++) await new Promise((r) => setTimeout(r, 5))
}
