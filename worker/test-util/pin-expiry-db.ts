import type { D1Database } from '@cloudflare/workers-types'

export function renewOnDelete(db: D1Database): D1Database {
  return new Proxy(db, {
    get(target, key) {
      if (key !== 'prepare') return Reflect.get(target, key)
      return (sql: string) => {
        if (sql.startsWith('DELETE FROM pin_attempts')) {
          return { bind: (...args: unknown[]) => ({ async run() {
            await db.prepare('UPDATE pin_attempts SET locked_until=100 WHERE scope=?').bind('ip').run()
            return db.prepare(sql).bind(...args).run()
          } }) }
        }
        return db.prepare(sql)
      }
    },
  }) as D1Database
}
