import type { ModelFamily } from './modelFamily'
import { modelFamily } from './modelFamily'
import type { ProviderIconFamily } from './usage-provider-family'
import providerIcons from './provider-icons.json'
import rules from './pane-icon-rules.json'
export type PaneIcon = ModelFamily | ProviderIconFamily
export function paneIconFamily(id?: string | null, provider?: string | null): PaneIcon {
  const known = modelFamily(id, provider)
  if (known !== 'other') return known
  const text = (id ?? '').toLowerCase()
  const hit = rules.find((r) => text.includes(r.match))
  if (hit) return hit.icon as PaneIcon
  return (providerIcons as Record<string, PaneIcon>)[provider ?? ''] ?? known
}
