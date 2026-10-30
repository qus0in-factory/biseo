import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { homedir } from 'node:os'

export function agyClientIdPath(): string {
  return process.env.BISEO_AGY_CLIENT_ID_FILE ??
    join(homedir(), '.config', 'biseo', 'secrets', 'agy-client-id')
}

export function readAgyClientIdFile(): string | null {
  try {
    const v = readFileSync(agyClientIdPath(), 'utf8').trim()
    return v ? v : null
  } catch {
    return null
  }
}
