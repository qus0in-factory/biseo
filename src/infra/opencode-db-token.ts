import { DatabaseSync as Db } from 'node:sqlite'
import { join } from 'node:path'
import { homedir } from 'node:os'

export type OpencodeCreds = { access: string | null; refresh: string | null }
export const readOpencodeDbCredential = (id: string) => readOpencodeDbAuth(id).access

export function readOpencodeDbAuth(id: string): OpencodeCreds {
  try {
    const db = new Db(join(homedir(), '.local/share/opencode/opencode.db'), { readOnly: true })
    const q = 'SELECT value FROM credential WHERE integration_id = ? ORDER BY time_updated DESC'
    const rows = db.prepare(q).all(id) as Array<{ value: string }>
    db.close()
    for (const r of rows) {
      const v = JSON.parse(r.value)
      if (v?.access && (!v.expires || v.expires > Date.now())) return { access: v.access, refresh: v.refresh ?? null }
    }
    const f = rows[0]?.value ? JSON.parse(rows[0].value) : null
    return { access: f?.access ?? null, refresh: f?.refresh ?? null }
  } catch {
    return { access: null, refresh: null }
  }
}
