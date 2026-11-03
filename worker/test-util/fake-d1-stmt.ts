import type { DatabaseSync } from 'node:sqlite'
import { meta, plain } from './fake-d1-row.js'
export class Stmt {
  constructor(private db: DatabaseSync, private sql: string, private args: unknown[] = []) {}
  bind(...args: unknown[]) { return new Stmt(this.db, this.sql, args) }
  async run() {
    const r = this.args.length ? this.db.prepare(this.sql).run(...(this.args as any[])) : this.db.prepare(this.sql).run()
    return { success: true, meta: meta(r), results: [] }
  }
  async first<T = unknown>(col?: string) {
    const r = plain(this.args.length ? this.db.prepare(this.sql).get(...(this.args as any[])) : this.db.prepare(this.sql).get()) as any
    return (col ? r?.[col] : r) as T ?? null
  }
  async all<T = unknown>() {
    const rows = this.args.length ? this.db.prepare(this.sql).all(...(this.args as any[])) : this.db.prepare(this.sql).all()
    return { success: true, results: rows.map(plain) as T[], meta: meta(null) }
  }
}
