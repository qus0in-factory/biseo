import type { AttemptStore } from '../app/ports.js'

export type RateCheck =
  | { ok: false; status: 429 | 500; error: string }
  | { ok: true; key: string; store: AttemptStore; ttl: number }
