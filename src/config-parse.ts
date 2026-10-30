export function parseLimitMarkers(value?: string): string[] | undefined {
  if (value === undefined) return undefined
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

export function parseInputMarkers(value?: string): string[] | undefined {
  return parseLimitMarkers(value)
}

export function parseInterruptAllowlist(value?: string): Record<string, string[]> | undefined {
  if (value === undefined) return undefined
  return JSON.parse(value) as Record<string, string[]>
}
