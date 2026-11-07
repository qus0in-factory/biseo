import { base } from '../config-file.js'

export interface AgyCliConfig {
  enabled: boolean
  path: string
  args: string[]
  timeoutMs: number
  cacheMs: number
  minIntervalMs: number
}

const hourMs = 3600000

const ms = (v: string | undefined, d: number): number => {
  const n = Number(v ?? NaN)
  return Number.isFinite(n) && n >= 0 ? n : d
}

export function agyCliConfig(): AgyCliConfig {
  const e = process.env
  const flag = e.BISEO_AGY_CLI_ENABLED
  // A legacy runtime flag must not silently opt into a paid model turn.
  return {
    enabled: flag === '1',
    path: e.BISEO_AGY_CLI_PATH ?? 'agy',
    args: (e.BISEO_AGY_CLI_ARGS ?? '-p /usage').split(/\s+/).filter(Boolean),
    timeoutMs: ms(e.BISEO_AGY_CLI_TIMEOUT_MS, base.agyCliTimeoutMs ?? 15000),
    cacheMs: ms(e.BISEO_AGY_CLI_CACHE_MS, 300000),
    minIntervalMs: Math.max(ms(e.BISEO_AGY_CLI_MIN_INTERVAL_MS, hourMs), hourMs)
  }
}
