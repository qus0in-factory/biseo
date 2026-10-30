export type UsageProviderState = 'available' | 'limited' | 'unknown'

export interface UsageMetric {
  id: string
  label: string
  unit: 'percent' | 'credits' | 'currency' | 'tokens' | 'requests' | string
  used: number | null
  limit: number | null
  remaining: number | null
  resetsAt: string | null
}

export interface UsageWindow {
  window: string
  usedPercent: number | null
  resetsAt: string | null
  checkedAt: string | null
  limitReached: boolean
  source: string | null
}

export interface UsageProvider {
  provider: string
  state: UsageProviderState
  windows: UsageWindow[]
  metrics?: UsageMetric[]
}

export interface UsageResponse {
  providers: UsageProvider[]
  stale?: boolean
  lastSuccessAt?: string | null
}

export interface UsageApiPort {
  getUsage(): Promise<UsageResponse>
}

export const usagePercentText = (v: number | null, unk: string) => v === null ? unk : `${v}%`
export const usageWindowName = (w: string, l: Record<string, string>) => l[`usageWindow_${w}`] ?? w
