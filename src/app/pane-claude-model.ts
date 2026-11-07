import { claudeSessionModel } from '../domain/claude-session-model.js'
import { claudeFill } from './pane-claude-fill.js'
import type { PaneModel } from '../domain/pane-model-parse.js'
import type { AgentInfo, PaneInfo } from '../domain/herdr.js'
type Read = (cwd: string, sessionId: string) => PaneModel | null
export function createClaudeFill(read: Read = claudeSessionModel, ttl = Number(process.env.BISEO_PANE_MODEL_TTL_MS ?? 5000), clock = () => Date.now()) {
  const hits = new Map<string, { at: number; value: PaneModel | null }>()
  return (out: Record<string, PaneModel>, panes: PaneInfo[], agents: AgentInfo[]) => claudeFill(read, hits, ttl, clock(), out, panes, agents)
}
export const fillClaudeModels = createClaudeFill()
