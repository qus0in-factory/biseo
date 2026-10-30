import type { ProviderUsage } from '../domain/usage-types.js'
import { unknownUsage } from '../domain/usage-unknown.js'
import { parseAgyUsage } from './agy-usage-parse.js'
import { fetchAgyGroups } from './agy-usage-auth.js'
import { agyCliConfig } from './agy-cli-config.js'
import { loadAgyCliGroups } from './agy-cli-fallback.js'

export async function fetchAgyUsage(now = new Date()): Promise<ProviderUsage> {
  const g = await fetchAgyGroups(now)
  if (g) return g.length === 0 ? unknownUsage('agy') : parseAgyUsage({ groups: g }, now)
  const cli = await loadAgyCliGroups(now.getTime())
  if (agyCliConfig().enabled) {
    const r = await fetchAgyGroups(new Date())
    if (r?.length) return parseAgyUsage({ groups: r }, now)
  }
  if (!cli) return unknownUsage('agy', 'agy_auth_expired')
  return cli.length === 0 ? unknownUsage('agy') : parseAgyUsage({ groups: cli }, now)
}
