import { writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

export const agyTestGroup = { displayName: 'Pool', families: ['unknown'], buckets: [{ bucketId: '3p-5h', window: '5h', remainingFraction: 1 }] }

export function putAgyTokenFile(name: string, expiry: string): string {
  const p = join(tmpdir(), name)
  writeFileSync(p, JSON.stringify({ token: { access_token: 'synthetic-old', refresh_token: 'synthetic-rt', expiry } }))
  return p
}

export function agyTestEnv(path: string): void {
  process.env.BISEO_AGY_TOKEN_PATH=path
  process.env.BISEO_AGY_TOKEN_URL ??= 'https://token.example/o'
  process.env.BISEO_AGY_CLIENT_ID ??= 'synthetic-id'
  process.env.BISEO_AGY_CLIENT_ID_FILE = join(tmpdir(), 'agy129-no-client-id')
  process.env.BISEO_AGY_KEYCHAIN_ENABLED='0'
  process.env.BISEO_AGY_CLI_ENABLED='0'
}

export function agyQuotaBody(u: string): unknown {
  if (u.includes('retrieveUserQuotaSummary')) return { groups: [agyTestGroup] }
  return { buckets: [] }
}
