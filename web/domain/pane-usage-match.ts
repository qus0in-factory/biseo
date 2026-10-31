import type { PaneSummary } from './timeline'
import type { UsageProvider } from './usage'
import { matchProviderKey } from './pane-usage-kind'

export function findMatchingUsage(
  pane: PaneSummary,
  providers: UsageProvider[],
): UsageProvider | null {
  const kind = pane.agentKind
  if (!kind) return null
  const target = matchProviderKey(kind)
  return providers.find((p) => p.provider === target) ?? null
}
