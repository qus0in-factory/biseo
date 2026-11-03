import type { AgentInfo, PaneInfo } from '../../src/domain/herdr.js'
import { ZERO_SHOT_PROMPT } from './zero-shot-record-fixture.js'

const session = {
  source: 'herdr:antigravity_cli',
  agent: 'agy',
  kind: 'id',
  value: 's1',
} as const

export const zeroShotPane: PaneInfo = {
  pane_id: 'w1T:p8',
  tab_id: 't8',
  workspace_id: 'w1T',
  terminal_id: 'term8',
  agent_status: 'idle',
  agent: 'agy',
  label: 'ga',
  agent_session: session,
  cwd: '/tmp',
  revision: 1,
}

export const zeroShotAgent: AgentInfo = {
  pane_id: 'w1T:p8',
  terminal_id: 'term8',
  agent_status: 'idle',
  agent: 'agy',
  name: 'ga',
  agent_session: session,
  revision: 1,
}

export const ZERO_SHOT_BODY = JSON.stringify({
  requestId: 'zs-1',
  workspaceId: 'w1T',
  paneId: 'w1T:p8',
  text: ZERO_SHOT_PROMPT,
})
