import type { ModelFamily } from './modelFamily'
import { modelFamily } from './modelFamily'
import providerIcons from './provider-icons.json'

export type ProviderIconFamily = 'ollama' | 'opencode' | 'grok' | 'xai' | 'antigravity'
export function usageProviderFamily(provider: string): ModelFamily | ProviderIconFamily {
  const icon = (providerIcons as Record<string, ProviderIconFamily>)[provider]
  if (icon) return icon
  return modelFamily(provider, provider)
}
