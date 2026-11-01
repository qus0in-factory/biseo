export type UsageHistoryConfig = {
  USAGE_HISTORY_RETENTION_DAYS?: string
  USAGE_HISTORY_MIN_SAMPLES?: string
}
function positive(value: string | undefined, fallback: number) {
  const number = Number(value)
  return Number.isSafeInteger(number) && number > 0 ? number : fallback
}
export function historyConfig(env: UsageHistoryConfig) {
  return {
    retention: positive(env.USAGE_HISTORY_RETENTION_DAYS, 30) * 86400000,
    minimum: positive(env.USAGE_HISTORY_MIN_SAMPLES, 2),
  }
}
