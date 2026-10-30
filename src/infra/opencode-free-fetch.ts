import type { ProviderUsage } from '../domain/usage-types.js'
import { evaluateFreeUsage } from './opencode-free-eval.js'

export async function fetchOpencodeFreeUsage(now = new Date()): Promise<ProviderUsage> {
  return evaluateFreeUsage(now)
}
