export function parsePinPreferred(body: unknown): boolean {
  if (!body || typeof body !== 'object') return false
  return (body as { pinPreferred?: unknown }).pinPreferred === true
}
