import type { SessionBindings } from './types.js'
import type { RefreshPolicy } from '../domain/refresh-types.js'

const positive = (v: string | undefined, fallback: number) => {
 const n = Number(v ?? fallback)
 if (!Number.isSafeInteger(n) || n <= 0) throw new Error('invalid refresh configuration')
 return n
}
export function refreshPolicy(e: SessionBindings): RefreshPolicy {
 return {
  absolute: positive(e.REFRESH_ABSOLUTE_SECONDS, 2592000),
  inactivity: positive(e.REFRESH_IDLE_SECONDS, 604800),
  maximum: positive(e.REFRESH_MAX_SESSIONS, 20),
  retention: positive(e.REFRESH_RETENTION_SECONDS, 86400),
 }
}
