import ky from 'ky'
import type { UsageApiPort } from '../domain/usage'

export const usageApi: UsageApiPort = {
  getUsage: () => ky.get('/api/usage', { retry: 0, credentials: 'same-origin' }).json(),
}
