import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { homedir } from 'node:os'
import type { ProviderUsage } from '../domain/usage-types.js'
import { agyUnknownUsage } from './agy-usage-unknown.js'

export async function fetchAgyUsage(now = new Date()): Promise<ProviderUsage> {
  try {
    const credPath = join(homedir(), '.gemini', 'oauth_creds.json')
    const raw = await readFile(credPath, 'utf8')
    const creds = JSON.parse(raw)
    const token = creds.access_token
    if (!token) return agyUnknownUsage(now)
    const res = await fetch('https://cloudcode-pa.googleapis.com/v1internal:retrieveUserQuotaSummary', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    })
    if (!res.ok) {
      return agyUnknownUsage(now)
    }
    return agyUnknownUsage(now)
  } catch {
    return agyUnknownUsage(now)
  }
}
