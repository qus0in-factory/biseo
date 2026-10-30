// A usage row is limited by its own values only: the upstream row flag, or a
// percent row that is fully used. The provider-wide state is never copied to
// every row, so one exhausted pool does not flag the other rows of a provider.
export const rowLimitReached = (
  flag: unknown,
  unit: string,
  used: number | null,
  limit: unknown,
  remaining: number | null,
): boolean => {
  if (flag === true) return true
  if (unit === 'percent') return (used !== null && used >= 100) || (remaining !== null && remaining <= 0)
  // Other units are absolute amounts, so they need a limit of their own.
  const l = typeof limit === 'number' ? limit : null
  return l !== null && l > 0 && used !== null && used >= l
}
