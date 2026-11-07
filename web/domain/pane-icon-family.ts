import type { ModelFamily } from './modelFamily'
import { modelFamily } from './modelFamily'
import type { ProviderIconFamily } from './usage-provider-family'
import providerIcons from './provider-icons.json'
import rules from './pane-icon-rules.json'
export type PaneIcon = ModelFamily | ProviderIconFamily
export function paneIconFamily(id?: string | null, provider?: string | null): PaneIcon {
  const text = `${id ?? ''} ${provider ?? ''}`.toLowerCase()
  const hit = rules.find((r) => text.includes(r.match))
  if (hit) return hit.icon as PaneIcon
  const icon = (providerIcons as Record<string, PaneIcon>)[provider ?? '']
  return icon ?? modelFamily(id, provider)
}
