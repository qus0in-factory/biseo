import type { PaneModel } from '../domain/pane-model-parse.js'
type Read = (cwd: string, sessionId: string) => PaneModel | null
type Hit = { at: number; value: PaneModel | null }
export function claudeModelHit(hits: Map<string, Hit>, read: Read, cwd: string, sessionId: string, now: number, ttl: number) {
  const key = `${cwd}\0${sessionId}`
  let hit = hits.get(key)
  if (!hit || now - hit.at >= ttl) { hit = { at: now, value: read(cwd, sessionId) }; hits.set(key, hit) }
  return hit.value
}
