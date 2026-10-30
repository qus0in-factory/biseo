import type { ProviderUsage } from '../domain/usage-types.js'
import { unknownUsage } from '../domain/usage-unknown.js'
import { parseAgyUsage } from './agy-usage-parse.js'
import { fetchAgyGroups } from './agy-usage-auth.js'

export async function fetchAgyUsage(now = new Date()): Promise<ProviderUsage> {
  const groups = await fetchAgyGroups(now)
  if (!groups) return unknownUsage('agy', 'agy_auth_expired')
  if (groups.length === 0) return unknownUsage('agy')
  return parseAgyUsage({ groups }, now)
}
