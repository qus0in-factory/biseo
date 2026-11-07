import { getUsageEndpoints, getUsageTimeoutMs } from '../domain/usage-endpoints.js'

export function requestGrokBilling(token: string) {
  return fetch(getUsageEndpoints().grok, {
    headers: {
      Authorization: `Bearer ${token}`,
      'X-XAI-Token-Auth': 'xai-grok-cli',
      'x-grok-client-version': '1.0.0',
      Accept: 'application/json'
    },
    signal: AbortSignal.timeout(getUsageTimeoutMs())
  })
}
