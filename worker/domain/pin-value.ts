const RE = /^\d{6}$/
export function isValidPin(v: unknown): v is string {
  return typeof v === 'string' && RE.test(v)
}
