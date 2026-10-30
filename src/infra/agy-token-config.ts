export interface AgyRefreshConfig {
  tokenUrl: string
  clientId: string | null
  clientSecret: string | null
  skewMs: number
}

export function agyRefreshConfig(): AgyRefreshConfig {
  const e = process.env
  const skew = Number(e.BISEO_AGY_TOKEN_SKEW_MS ?? 60000)
  return {
    tokenUrl: e.BISEO_AGY_TOKEN_URL ?? 'https://oauth2.googleapis.com/token',
    clientId: e.BISEO_AGY_CLIENT_ID ?? null,
    clientSecret: e.BISEO_AGY_CLIENT_SECRET ?? null,
    skewMs: Number.isFinite(skew) && skew >= 0 ? skew : 60000
  }
}
