import { claudeSessionModel } from '../domain/claude-session-model.js'
import type { PaneModel } from '../domain/pane-model-parse.js'
import type { AgentInfo, PaneInfo } from '../domain/herdr.js'
export function fillClaudeModels(out: Record<string, PaneModel>, panes: PaneInfo[], agents: AgentInfo[]) {
  const by = new Map(agents.map((a) => [a.pane_id, a]))
  for (const p of panes) {
    if (out[p.pane_id]) continue
    const a = by.get(p.pane_id)
    if ((a?.agent ?? p.agent) !== 'claude') continue
    const sessionId = a?.agent_session?.value ?? p.agent_session?.value
    const cwd = p.cwd ?? a?.cwd
    const model = sessionId && cwd ? claudeSessionModel(cwd, sessionId) : null
    if (model) out[p.pane_id] = model
  }
}
