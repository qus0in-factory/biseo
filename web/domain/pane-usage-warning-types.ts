export interface PaneUsageWarningResult {
  hasWarning: boolean
  exceededWindows: string[]
  isUnknown: boolean
  label: string | null
}
