import { fresh, future, old } from './codex-availability-fixture.test.js'
export const limitedRate = () => ({
  primary: { used_percent: 99, resets_at: future },
  secondary: null,
  rate_limit_reached_type: 'primary',
})
export const freeRate = () => ({
  primary: { used_percent: 10, resets_at: future },
  secondary: null,
  rate_limit_reached_type: null,
})
export const elapsedRate = () => ({
  primary: { resets_at: old },
  rate_limit_reached_type: 'primary',
})
export const token = (rate: unknown, at: string | null = fresh, text = 'SECRET conversation') =>
  JSON.stringify({
    timestamp: at,
    type: 'event_msg',
    payload: { type: 'token_count', rate_limits: rate, content: text },
  })
