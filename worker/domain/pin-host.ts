export function isPinHostAllowed(url: string, allowed: string[]): boolean {
  try {
    const u = new URL(url)
    return u.protocol === 'https:' && allowed.includes(u.hostname.toLowerCase())
  } catch {
    return false
  }
}

export const PIN_CUSTOM_HOST = 'biseo.qus0in.dev'

export function isPinCustomHost(url: string): boolean {
  try {
    return new URL(url).hostname.toLowerCase() === PIN_CUSTOM_HOST
  } catch {
    return false
  }
}
