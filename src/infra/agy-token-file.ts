import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { homedir } from 'node:os'

export interface AgyTokenFile {
  access: string
  refresh: string | null
  expiresAt: number | null
}

export function isAgyTokenFresh(expiresAt: number | null, nowMs: number, skewMs: number): boolean {
  if (expiresAt === null) return true
  return expiresAt - nowMs > skewMs
}

export async function readAgyTokenFile(): Promise<AgyTokenFile | null> {
  try {
    const p = process.env.BISEO_AGY_TOKEN_PATH ??
      join(homedir(), '.gemini', 'antigravity-cli', 'antigravity-oauth-token')
    const t = JSON.parse(await readFile(p, 'utf8'))?.token
    if (typeof t?.access_token !== 'string') return null
    const exp = typeof t?.expiry === 'string' ? Date.parse(t.expiry) : NaN
    const refresh = typeof t?.refresh_token === 'string' ? t.refresh_token : null
    return { access: t.access_token, refresh, expiresAt: Number.isFinite(exp) ? exp : null }
  } catch {
    return null
  }
}
