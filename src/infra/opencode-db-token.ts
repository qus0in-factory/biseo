import { DatabaseSync } from 'node:sqlite'
import { join } from 'node:path'
import { homedir } from 'node:os'

export function readOpencodeDbCredential(integrationId: string): string | null {
  try {
    const dbPath = join(homedir(), '.local', 'share', 'opencode', 'opencode.db')
    const db = new DatabaseSync(dbPath, { readOnly: true })
    const stmt = db.prepare('SELECT value FROM credential WHERE integration_id = ? ORDER BY time_updated DESC')
    const rows = stmt.all(integrationId) as Array<{ value: string }>
    db.close()
    for (const r of rows) {
      const parsed = JSON.parse(r.value)
      if (parsed?.access && (!parsed.expires || parsed.expires > Date.now())) {
        return parsed.access
      }
    }
    return rows[0]?.value ? JSON.parse(rows[0].value)?.access ?? null : null
  } catch {
    return null
  }
}
