import type { AvailabilityPort } from '../app/ports.js'
import { toProviderUsage } from '../domain/usage-format.js'
import type { UsageReport } from '../domain/usage-types.js'

export class UsageCollector {
  private last: UsageReport | null = null

  constructor(private readonly avail: AvailabilityPort) {}

  async getReport(now = new Date()): Promise<UsageReport> {
    try {
      const a = await this.avail.get({ source: 'biseo:codex', agent: 'codex', kind: 'id', value: 'default' }, now)
      const rep: UsageReport = { providers: [toProviderUsage('codex', a)], updatedAt: now.toISOString() }
      this.last = rep
      return rep
    } catch {
      if (this.last) return this.last
      const un = { state: 'unknown' as const, source: 'codex', checkedAt: null, observedAt: now.toISOString(), resetsAt: null, reason: 'err', window: null }
      return { providers: [toProviderUsage('codex', un)], updatedAt: now.toISOString() }
    }
  }
}
