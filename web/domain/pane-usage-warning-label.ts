export function formatWarningLabel(
  exceeded: string[],
  res?: Record<string, string>,
): string {
  const prefix = res?.usageWarningPrefix ?? '사용량 한도 임박: '
  return `${prefix}${exceeded.join('/')}`
}
