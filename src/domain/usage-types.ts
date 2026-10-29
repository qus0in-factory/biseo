export interface ProviderUsage {
  provider: string
  state: 'available' | 'limited' | 'unknown'
  resetsAt: string | null
  checkedAt: string | null
  limitReached: boolean
  window: 'primary' | 'secondary' | null
  usedPercent: number | null
}

export interface UsageReport {
  providers: ProviderUsage[]
  updatedAt: string
}
