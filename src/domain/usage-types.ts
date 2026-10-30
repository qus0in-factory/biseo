export interface UsageMetric {
  id: string
  label: string
  unit: 'percent' | 'credits' | 'currency' | 'tokens' | 'requests' | string
  used: number | null
  limit: number | null
  remaining: number | null
  resetsAt: string | null
}

export interface WindowUsage {
  window: string
  usedPercent: number | null
  resetsAt: string | null
  checkedAt: string | null
  limitReached: boolean
  source: string | null
}

export interface ProviderUsage {
  provider: string
  state: 'available' | 'limited' | 'unknown'
  metrics: UsageMetric[]
  windows: WindowUsage[]
  source?: string | null
  checkedAt?: string | null
  reason?: string | null
  retryAt?: string | null
}

export interface UsageReport {
  providers: ProviderUsage[]
  updatedAt: string
}
