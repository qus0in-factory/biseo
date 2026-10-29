import { mkdtempSync as mk, rmSync as rm } from 'node:fs'
import { DatabaseSync } from 'node:sqlite'

export const withSessionDb = async (run: () => Promise<void>) => {
  const dir = mk('/tmp/f-')
  const p = dir + '/d'
  const db = new DatabaseSync(p)
  db.exec('CREATE TABLE session_message(session_id,type,seq,data)')
  const ins = db.prepare('INSERT INTO session_message VALUES(?,?,?,?)')
  ins.run('ses_9', 'user', 0, JSON.stringify({ text: 'hi' }))
  ins.run('ses_9', 'assistant', 1, JSON.stringify({ content: [{ type: 'text', text: 'ok' }] }))
  ins.run('ses_9', 'idle', 2, JSON.stringify({ outcome: 'succeeded' }))
  process.env.BISEO_OPENCODE_DB = p
  try {
    await run()
  } finally {
    delete process.env.BISEO_OPENCODE_DB
    db.close()
    rm(dir, { recursive: true })
  }
}
