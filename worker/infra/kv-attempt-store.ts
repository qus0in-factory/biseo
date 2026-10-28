import type { KVNamespace } from '@cloudflare/workers-types'
import type { AttemptStore } from '../app/ports.js'

export function createKvAttemptStore(kv: KVNamespace): AttemptStore {
  return {
    async get(key: string) {
      const val = await kv.get(key)
      return val ? parseInt(val, 10) || 0 : 0
    },
    async increment(key: string, ttlSeconds: number) {
      const current = await this.get(key)
      const next = current + 1
      await kv.put(key, String(next), {
        expirationTtl: Math.max(60, ttlSeconds),
      })
      return next
    },
    async clear(key: string) {
      await kv.delete(key)
    },
  }
}
