import type { ModelFamily } from './modelFamily'
import { modelFamily } from './modelFamily'

export function usageProviderFamily(provider: string): ModelFamily {
  if (provider === 'agy') return 'gemini'
  return modelFamily(provider, provider)
}
