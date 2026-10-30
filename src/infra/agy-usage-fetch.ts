import type { ProviderUsage } from '../domain/usage-types.js'
import { unknownUsage } from '../domain/usage-unknown.js'
import { readAgyToken } from './agy-token.js'
import { parseAgyUsage } from './agy-usage-parse.js'
import { fetchAgySummary } from './agy-summary-fetch.js'
import { fetchAgyModelGroups } from './agy-quota-fetch.js'
import { mergeAgyGroups } from './agy-usage-merge.js'

export async function fetchAgyUsage(now = new Date()): Promise<ProviderUsage> {
  const token = await readAgyToken()
  if (!token) return unknownUsage('agy')
  const [summary, derived] = await Promise.all([fetchAgySummary(token), fetchAgyModelGroups(token)])
  const groups = mergeAgyGroups(summary, derived)
  if (groups.length === 0) return unknownUsage('agy')
  return parseAgyUsage({ groups }, now)
}
