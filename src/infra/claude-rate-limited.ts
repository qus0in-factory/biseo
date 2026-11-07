import { unknownUsage } from '../domain/usage-unknown.js'
import { resolveClaude } from './claude-snapshot-store.js'

export function held(now: Date, retryAt: string) {
  return resolveClaude(now, unknownUsage('claude', 'rate_limited', retryAt))
}
