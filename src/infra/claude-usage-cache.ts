import type { ProviderUsage } from '../domain/usage-types.js'

let latest: ProviderUsage | null = null

export function noteClaudePoll(u: ProviderUsage): void {
  latest = u
}

export function claudePoll(): ProviderUsage | null {
  return latest
}

export function resetClaudePoll(): void {
  latest = null
}
