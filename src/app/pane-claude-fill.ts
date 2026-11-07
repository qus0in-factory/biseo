import { claudeModelHit } from './claude-model-hit.js'
import type { PaneModel } from '../domain/pane-model-parse.js'
import type { AgentInfo, PaneInfo } from '../domain/herdr.js'
type Read = (cwd: string, sessionId: string) => PaneModel | null
type Hit = { at: number; value: PaneModel | null }
export function claudeFill(read: Read, hits: Map<string, Hit>, ttl: number, now: number, out: Record<string, PaneModel>, panes: PaneInfo[], agents: AgentInfo[]) {
  const by = new Map(agents.map((a) => [a.pane_id, a]))
  for (const p of panes) {
    if (out[p.pane_id]) continue
    const a = by.get(p.pane_id)
    if ((a?.agent ?? p.agent) !== 'claude') continue
    const sessionId = a?.agent_session?.value ?? p.agent_session?.value
    const cwd = p.cwd ?? a?.cwd
    if (!sessionId || !cwd) continue
    const model = claudeModelHit(hits, read, cwd, sessionId, now, ttl)
    if (model) out[p.pane_id] = model
  }
}
