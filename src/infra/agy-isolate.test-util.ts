import { clearAgyTokenCache } from './agy-token.js'
import { resetAgyCliCache } from './agy-cli-fallback.js'
export async function isolatedAgy<T>(run: () => Promise<T>, extra: Record<string, string> = {}): Promise<T> {
  const prev: Record<string, string | undefined> = { BISEO_AGY_CLI_ENABLED: process.env.BISEO_AGY_CLI_ENABLED }
  for (const k of Object.keys(extra)) { prev[k] = process.env[k]; process.env[k] = extra[k] }
  process.env.BISEO_AGY_CLI_ENABLED = '0'
  clearAgyTokenCache()
  resetAgyCliCache()
  try { return await run() } finally {
    for (const k of Object.keys(prev)) {
      if (prev[k] === undefined) delete process.env[k]
      else process.env[k] = prev[k]
    }
    clearAgyTokenCache()
    resetAgyCliCache()
  }
}
