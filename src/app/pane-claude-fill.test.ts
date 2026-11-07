import assert from 'node:assert/strict'
import test from 'node:test'
import { createClaudeFill } from './pane-claude-model.js'
import type { AgentInfo, PaneInfo } from '../domain/herdr.js'
test('claude session fallback is cached including a miss', () => {
  let calls = 0
  const fill = createClaudeFill(() => { calls++; return calls === 1 ? { modelId: 'opus-5.5', provider: 'claude' } : null }, 1000, () => 0)
  const pane = { pane_id: 'p', cwd: '/tmp/mandalart', agent: 'claude', agent_session: { value: 'ses' } } as PaneInfo
  const agents = [] as AgentInfo[]
  const a: Record<string, { modelId: string }> = {}
  fill(a, [pane], agents)
  fill(a, [pane], agents)
  assert.equal(calls, 1)
  assert.equal(a.p.modelId, 'opus-5.5')
})
