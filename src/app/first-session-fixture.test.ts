import type { AgentSession } from '../domain/herdr.js'
import type { Target } from '../domain/turn-policy.js'

export const pane = {
  pane_id: 'w:p1',
  tab_id: 't',
  workspace_id: 'w',
  terminal_id: 'term',
  agent_status: 'idle' as const,
  agent: 'opencode',
  revision: 1,
}
export const noSes: Target = { pane }
export const session = (value: string): AgentSession => ({
  source: 'herdr:opencode',
  agent: 'opencode',
  kind: 'id',
  value,
})
export const herdStub = (o: { pane?: unknown; agent?: unknown; onPrompt?: () => void } = {}) => ({
  listPanes: async () => [],
  listAgents: async () => [],
  getPane: async () => o.pane,
  getAgent: async () => o.agent,
  prompt: async () => { o.onPrompt?.() },
})
export const noSub = async () => () => {}
