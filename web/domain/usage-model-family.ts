// agy metric ids are `${familyKey}:${pool}:${bucket}` (see src/infra/agy-usage-metric.ts).
// The key is detected from the agy quota data, the display name lives in resources.json.
export const usageModelFamilyKey = (provider: string, metricId: string): string => {
  if (provider !== 'agy') return ''
  return metricId.split(':')[0]?.trim() ?? ''
}

export const usageModelFamilyName = (
  provider: string,
  metricId: string,
  l: Record<string, string>,
): string => {
  const key = usageModelFamilyKey(provider, metricId)
  if (!key) return ''
  return l[`usageModelFamily_${key}`] ?? l.usageModelFamily_unknown ?? ''
}
