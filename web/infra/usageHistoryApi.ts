import ky from './sessionHttp'
import type { UsageHistoryRatio } from '../../shared/usage-history'

export function getUsageHistory(provider: string) {
  return ky.get(`/api/usage/history/${encodeURIComponent(provider)}`, {
    retry: 0, credentials: 'same-origin',
  }).json<UsageHistoryRatio>()
}
