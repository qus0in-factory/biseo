import assert from 'node:assert/strict'
import test from 'node:test'
import { createPaneModelCache } from './pane-model-cache.js'
import type { HerdrPort } from './ports.js'
test('concurrent initial snapshots wait for the same model observation', async () => {
  let finish!: (lines: string[]) => void
  let calls = 0
  const h = { readRecent: () => { calls++; return new Promise<string[]>(resolve => { finish = resolve }) } } as unknown as HerdrPort
  const cache = createPaneModelCache()
  const panes = [{ paneId: 'cold:p1', agentKind: 'opencode' }]
  const first = cache(h, panes)
  const second = cache(h, panes)
  finish(['Build auto · Opus 5.5 Claude Agent · low'])
  const expected = { 'cold:p1': { modelId: 'opus-5.5', provider: 'claude' } }
  assert.deepEqual(await first, expected)
  assert.deepEqual(await second, expected)
  assert.equal(calls, 1)
})
