export type UsageProviderState = 'available' | 'limited' | 'unknown'

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
}

export interface UsageResponse {
  providers: UsageProvider[]
  stale?: boolean
  lastSuccessAt?: string | null
}

export interface UsageApiPort {
  getUsage(): Promise<UsageResponse>
}

export const usagePercentText = (value: number | null, unknown: string) =>
  value === null ? unknown : `${value}%`

export const usageWindowName = (window: string, labels: Record<string, string>) =>
  labels[`usageWindow_${window}`] ?? window

