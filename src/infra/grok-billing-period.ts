const windows = new Map([
  ['USAGE_PERIOD_TYPE_WEEKLY', 'w'],
  ['USAGE_PERIOD_TYPE_MONTHLY', 'm']
])

export function grokBillingPeriod(root: any) {
  const start = root?.billingPeriodStart
  return {
    window: windows.get(root?.currentPeriod?.type) ?? 'primary',
    startsAt: typeof start === 'string' && Number.isFinite(Date.parse(start)) ? start : null
  }
}
