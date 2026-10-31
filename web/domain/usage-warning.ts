export type UsageWarningConfig = {
  fiveHour: number
  weekly: number
  monthly: number
}

export const DEFAULT_USAGE_WARNING_CONFIG: UsageWarningConfig = {
  fiveHour: 90,
  weekly: 98,
  monthly: 98,
}
