import type { ProviderUsage } from '../domain/usage-types.js'
import { unknownUsage } from '../domain/usage-unknown.js'

export async function safeFetch(name: string, fn: (now: Date) => Promise<ProviderUsage>, now: Date): Promise<ProviderUsage> {
  try {
    return await fn(now)
  } catch {
    return unknownUsage(name)
  }
}
