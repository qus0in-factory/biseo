const HEX = /^[0-9a-fA-F:.]+$/

export function parseIpv6(s: string): string | null {
  if (!s.includes(':') || s.includes('%') || !HEX.test(s)) return null
  try {
    const h = new URL(`http://[${s}]/`).hostname
    return h.startsWith('[') ? h.slice(1, -1).toLowerCase() : null
  } catch {
    return null
  }
}

export function isPublicIpv6(s: string): boolean {
  if (s.startsWith('::') || s.startsWith('fc') || s.startsWith('fd')) return false
  if (/^fe[89ab]/.test(s) || s.startsWith('ff')) return false
  return true
}
