export interface AgyResolved {
  token: string | null
  reason: string | null
  refreshed: boolean
}

export const agyOk = (token: string, refreshed: boolean): AgyResolved => ({ token, reason: null, refreshed })

export const agyExpired = (): AgyResolved => ({ token: null, reason: 'agy_auth_expired', refreshed: false })
