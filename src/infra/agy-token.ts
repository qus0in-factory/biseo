import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { homedir } from 'node:os'

export async function readAgyToken(): Promise<string | null> {
  try {
    const p = process.env.BISEO_AGY_TOKEN_PATH ??
      join(homedir(), '.gemini', 'antigravity-cli', 'antigravity-oauth-token')
    const raw = await readFile(p, 'utf8')
    return JSON.parse(raw)?.token?.access_token ?? null
  } catch {
    return null
  }
}
