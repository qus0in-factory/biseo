import type { ProviderUsage } from '../domain/usage-types.js'
import { agyUnknownUsage } from './agy-usage-unknown.js'

export async function fetchAgyUsage(now = new Date()): Promise<ProviderUsage> {
  return agyUnknownUsage(now)
}
