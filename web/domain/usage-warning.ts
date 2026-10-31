import r from '../resources.json'

export type UsageWarningConfig = {
  fiveHour: number
  weekly: number
  monthly: number
}

const res = r as Record<string, unknown>

export const DEFAULT_USAGE_WARNING_CONFIG: UsageWarningConfig = {
  fiveHour: Number(res.usageThresholdFiveHour ?? 90),
  weekly: Number(res.usageThresholdWeekly ?? 98),
  monthly: Number(res.usageThresholdMonthly ?? 98),
}
