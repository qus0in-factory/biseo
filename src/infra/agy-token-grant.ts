import type { AgyRefreshConfig } from './agy-token-config.js'

export interface AgyRefreshed {
  access: string
  expiresAt: number | null
  refresh: string | null
}

export function agyGrantBody(refresh: string, c: AgyRefreshConfig): string {
  const b = new URLSearchParams({ grant_type: 'refresh_token', refresh_token: refresh })
  b.set('client_id', c.clientId as string)
  if (c.clientSecret) b.set('client_secret', c.clientSecret)
  return b.toString()
}
