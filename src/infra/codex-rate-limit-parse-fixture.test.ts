export const line = (rate: unknown, at: unknown = '2026-10-29T10:00:00.000Z') =>
  JSON.stringify({
    timestamp: at,
    type: 'event_msg',
    payload: { type: 'token_count', rate_limits: rate, message: 'SECRET body' },
  })
