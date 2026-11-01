export type DetectedUsageWindow = '5h' | 'w' | 'm' | 'unknown'

// Remaining time until reset is not the duration of a quota window.
export function detectUsageWindow(seconds: unknown): DetectedUsageWindow {
  if (seconds === 18000) return '5h'
  if (seconds === 604800) return 'w'
  if (typeof seconds === 'number' && Number.isInteger(seconds / 86400)
    && seconds >= 28 * 86400 && seconds <= 31 * 86400) return 'm'
  return 'unknown'
}
