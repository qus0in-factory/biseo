export interface UsageHistoryPoint {
  provider: string
  observed: number
  five: number
  week: number
  fiveReset: string
  weekReset: string
}
export interface UsageHistoryRatio {
  ratio: number | null
  samples: number
  from: number | null
  to: number | null
}
