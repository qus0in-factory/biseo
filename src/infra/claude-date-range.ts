// ECMAScript TimeClip limit, in milliseconds (not an operational timeout).
export const DATE_LIMIT_MS = 8.64e15

export function dateMs(value: number): number {
  if (Number.isNaN(value)) return 0
  return Math.max(-DATE_LIMIT_MS, Math.min(DATE_LIMIT_MS, value))
}
