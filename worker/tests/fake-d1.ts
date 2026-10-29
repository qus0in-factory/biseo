import { DatabaseSync } from 'node:sqlite'
import type { D1Database } from '@cloudflare/workers-types'
import { SCHEMA } from './fake-d1-schema.js'
import { Stmt } from './fake-d1-stmt.js'
export function createFakeD1(): D1Database {
  const db = new DatabaseSync(':memory:')
  db.exec(SCHEMA)
  return {
    prepare: (sql: string) => new Stmt(db, sql),
    batch: async (stmts: Stmt[]) => Promise.all(stmts.map((s) => s.run())),
    exec: async (sql: string) => { db.exec(sql); return { count: 0, duration: 0 } },
  } as unknown as D1Database
}
