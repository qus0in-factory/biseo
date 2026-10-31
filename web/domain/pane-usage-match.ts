import type { PaneSummary } from './timeline'
import type { UsageProvider } from './usage'
import { matchProviderKey } from './pane-usage-kind'

export function findMatchingUsage(
  pane: PaneSummary,
  providers: UsageProvider[],
): UsageProvider | null {
  const target = matchProviderKey(pane.agentKind)
  if (!target) return null
  return providers.find((p) => p.provider === target) ?? null
}
