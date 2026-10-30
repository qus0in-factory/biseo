export interface AgyCliConfig {
  enabled: boolean
  path: string
  args: string[]
  timeoutMs: number
  cacheMs: number
}

const ms = (v: string | undefined, d: number): number => {
  const n = Number(v ?? NaN)
  return Number.isFinite(n) && n >= 0 ? n : d
}

export function agyCliConfig(): AgyCliConfig {
  const e = process.env
  return {
    enabled: e.BISEO_AGY_CLI_ENABLED === '1',
    path: e.BISEO_AGY_CLI_PATH ?? 'agy',
    args: (e.BISEO_AGY_CLI_ARGS ?? '-p /usage').split(/\s+/).filter(Boolean),
    timeoutMs: ms(e.BISEO_AGY_CLI_TIMEOUT_MS, 15000),
    cacheMs: ms(e.BISEO_AGY_CLI_CACHE_MS, 300000)
  }
}
