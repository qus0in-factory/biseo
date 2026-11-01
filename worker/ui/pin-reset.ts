import type { SessionBindings } from './types.js'

// Password success clears every PIN lock. Best-effort: PIN storage must not block login.
export async function resetPinLock(env: SessionBindings) {
  const db = env.BISEO_DB
  if (!db) return
  try {
    await db.prepare('DELETE FROM pin_attempts').run()
  } catch {}
}
