import type { ProviderUsage } from '../domain/usage-types.js'

export type GrokFailure = 'auth_required' | 'temporarily_unavailable' | 'schema_error'
export type GrokResult = { usage: ProviderUsage } | { reason: GrokFailure }

export function billingFailure(reason: GrokFailure, stage: string, status?: number): GrokResult {
  console.warn(JSON.stringify({ provider: 'grok', stage, status, reason }))
  return { reason }
}
