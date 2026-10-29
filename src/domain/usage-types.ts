export interface WindowUsage {
  window: 'primary' | 'secondary'
  usedPercent: number | null
  resetsAt: string | null
  checkedAt: string | null
  limitReached: boolean
  source: string | null
}

export interface ProviderUsage {
  provider: string
  state: 'available' | 'limited' | 'unknown'
  windows: WindowUsage[]
}

export interface UsageReport {
  providers: ProviderUsage[]
  updatedAt: string
}
