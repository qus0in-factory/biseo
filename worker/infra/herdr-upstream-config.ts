import { resolveHttpsUpstreamBase } from '../domain/origin-guard.js'
import type { ServiceTokenEnv } from './service-token-env.js'
import { createServiceToken } from './service-token.js'

export type UpstreamEnv = ServiceTokenEnv & {
  FUNNEL_BASE_URL?: string
  FUNNEL_HEALTH_URL?: string
  UPSTREAM_TIMEOUT_MS?: string
  HEALTH_TIMEOUT_MS?: string
}

export async function prepareUpstreamCall(env: UpstreamEnv) {
  const base = resolveHttpsUpstreamBase(env.FUNNEL_BASE_URL, env.FUNNEL_HEALTH_URL)
  const token = await createServiceToken(env)
  const rawMs = Number(env.UPSTREAM_TIMEOUT_MS || env.HEALTH_TIMEOUT_MS || 10000)
  const timeoutMs = Number.isFinite(rawMs) && rawMs > 0 ? rawMs : 0
  if (!base || !token || !timeoutMs) return null
  return { base, token, timeoutMs }
}
