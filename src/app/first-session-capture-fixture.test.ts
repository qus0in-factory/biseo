import type { TimelineItem } from '../domain/timeline.js'
import { herdStub, pane } from './first-session-fixture.test.js'

export const captureItem: TimelineItem = {
  requestId: 'r1',
  workspaceId: 'w',
  paneId: 'w:p1',
  targetName: 'o',
  agentKind: 'opencode',
  promptText: 'hi',
  status: 'queued',
  responseText: null,
  errorCode: null,
  createdAt: '2026-01-01T00:00:00Z',
  seq: 1,
  completedAt: null,
}
export const opencodeAgent = {
  pane_id: 'w:p1',
  terminal_id: 'term',
  agent_status: 'idle',
  agent: 'opencode',
  revision: 1,
}
export const captureHerdr = (onPrompt: () => void) =>
  herdStub({ pane, agent: opencodeAgent, onPrompt })
