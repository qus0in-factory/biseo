import { getUsageEndpoints } from '../domain/usage-endpoints.js'

export interface AgyRefreshConfig {
  clientId: string | null
  clientSecret: string | null
  skewMs: number
}

export function agyRefreshConfig(): AgyRefreshConfig {
  const e = process.env
  const skew = Number(e.BISEO_AGY_TOKEN_SKEW_MS ?? 60000)
  return {
    clientId: e.BISEO_AGY_CLIENT_ID ?? null,
    clientSecret: e.BISEO_AGY_CLIENT_SECRET ?? null,
    skewMs: Number.isFinite(skew) && skew >= 0 ? skew : 60000
  }
}

export const agyTokenUrl = () => getUsageEndpoints().agyToken
