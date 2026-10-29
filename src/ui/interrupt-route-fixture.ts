export const post = (body: unknown, auth = 'Bearer x') => ({
  method: 'POST',
  headers: { authorization: auth, 'content-type': 'application/json' },
  body: JSON.stringify(body),
})
export const limitedAvailability = (resetsAt: string) => ({
  state: 'limited' as const,
  source: 'codex',
  checkedAt: new Date().toISOString(),
  resetsAt,
  reason: 'rate_limit_reached',
  window: 'primary' as const,
})
export const limitedBody = (resetsAt: string) => ({
  error: 'target_not_ready',
  reason: 'usage_limited',
  resetsAt,
})
