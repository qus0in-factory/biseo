export function isOriginAllowed(
  requestUrl: string,
  originHeader: string | undefined | null,
  allowedOrigins?: string,
): boolean {
  if (!originHeader) return false
  let reqOrigin: string
  let givenOrigin: string
  try {
    reqOrigin = new URL(requestUrl).origin
    givenOrigin = new URL(originHeader).origin
  } catch {
    return false
  }
  if (givenOrigin !== originHeader) return false
  const list = (allowedOrigins || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  if (givenOrigin === reqOrigin) return true
  if (list.length === 0) return false
  return list.includes(givenOrigin)
}

export function resolveHttpsUpstreamBase(
  upstreamUrl?: string,
  healthUrl?: string,
): string | null {
  const raw = upstreamUrl?.trim() || healthUrl?.trim()
  if (!raw) return null
  try {
    const parsed = new URL(raw)
    if (parsed.protocol !== 'https:' || parsed.username || parsed.password) {
      return null
    }
    return parsed.origin
  } catch {
    return null
  }
}
