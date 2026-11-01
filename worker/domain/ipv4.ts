export function parseIpv4(s: string): string | null {
  const p = s.split('.')
  if (p.length !== 4) return null
  const n = p.map((x) =>
    /^\d{1,3}$/.test(x) && (x === '0' || !x.startsWith('0')) ? Number(x) : NaN,
  )
  if (n.some((x) => !Number.isInteger(x) || x < 0 || x > 255)) return null
  return n.join('.')
}

export function isPublicIpv4(s: string): boolean {
  const n = s.split('.').map(Number)
  if (n[0] === 0 || n[0] === 10 || n[0] === 127) return false
  if (n[0] === 169 && n[1] === 254) return false
  if (n[0] === 172 && n[1] >= 16 && n[1] <= 31) return false
  if (n[0] === 192 && n[1] === 168) return false
  return n[0] < 224
}
