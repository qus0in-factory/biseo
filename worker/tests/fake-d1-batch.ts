import type { DatabaseSync } from 'node:sqlite'
import type { Stmt } from './fake-d1-stmt.js'

export function atomicBatch(db: DatabaseSync) {
 let tail: Promise<unknown> = Promise.resolve()
 return (stmts: Stmt[]) => {
  const task = tail.then(async () => {
   db.exec('BEGIN')
   try {
    const results = []
    for (const s of stmts) results.push(await s.run())
    db.exec('COMMIT')
    return results
   } catch (e) { db.exec('ROLLBACK'); throw e }
  })
  tail = task.catch(() => {})
  return task
 }
}
