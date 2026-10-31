import type { UsageApiPort } from '../domain/usage'
import { useUsage } from './useUsage'

export function useUsageBackground(api: UsageApiPort, enabled: boolean) {
  useUsage(api, enabled)
}
