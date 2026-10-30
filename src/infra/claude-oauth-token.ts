import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { homedir } from 'node:os'

export async function readClaudeToken(): Promise<string | null> {
  try {
    const p = join(homedir(), '.claude', '.credentials.json')
    return JSON.parse(await readFile(p, 'utf8')).claudeAiOauth?.accessToken ?? null
  } catch {
    return null
  }
}
