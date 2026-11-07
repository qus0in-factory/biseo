import { base } from '../config-file.js'

export interface AgyCliConfig {
  enabled: boolean
  path: string
  args: string[]
  timeoutMs: number
  cacheMs: number
  minIntervalMs: number
}

const tenMinutesMs = 600000

const ms = (v: string | undefined, d: number): number => {
  const n = Number(v ?? NaN)
  return Number.isFinite(n) && n >= 0 ? n : d
}

export function agyCliConfig(): AgyCliConfig {
  const e = process.env
  // Only an explicit '0' disables the verified quota lookup.
  return {
    enabled: e.BISEO_AGY_CLI_ENABLED !== '0',
    path: e.BISEO_AGY_CLI_PATH ?? 'agy',
    args: (e.BISEO_AGY_CLI_ARGS ?? '-p /quota').split(/\s+/).filter(Boolean),
    timeoutMs: ms(e.BISEO_AGY_CLI_TIMEOUT_MS, base.agyCliTimeoutMs ?? 15000),
    cacheMs: ms(e.BISEO_AGY_CLI_CACHE_MS, 300000),
    minIntervalMs: Math.max(ms(e.BISEO_AGY_CLI_MIN_INTERVAL_MS, tenMinutesMs), tenMinutesMs)
  }
}
