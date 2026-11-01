export function isPinHostAllowed(url: string, allowed: string[]): boolean {
  try {
    const u = new URL(url)
    return u.protocol === 'https:' && allowed.includes(u.hostname.toLowerCase())
  } catch {
    return false
  }
}
