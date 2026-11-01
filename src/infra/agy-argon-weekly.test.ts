import test from 'node:test'
import assert from 'node:assert/strict'
import { fetchAgyUsage } from './agy-usage-fetch.js'
import { agyTestGroup } from './agy-test-support.test-util.js'
import { setupCli, doneCli } from './agy-cli-scenario.test-util.js'

test('successful API adds actual CLI Argon weekly value', async () => {
  const calls: string[] = []
  const out = 'GEMINI 4 ARGON\nGemini 4 Argon Weekly Limit\n#### 100.00%\nRefreshes in 32h 37m'
  const { p, o } = setupCli('agy-argon-weekly', '2030-01-01', '1', out, calls,
    () => Response.json({ groups: [agyTestGroup] }))
  try {
    const usage = await fetchAgyUsage(new Date('2026-10-30T12:00:00Z'))
    const metric = usage.metrics.find(m => m.id.startsWith('argon:'))
    assert.equal(metric?.used, 100)
    assert.equal(metric?.remaining, 0)
    assert.equal(metric?.resetsAt, '2026-10-31T20:37:00.000Z')
    assert.equal(calls.length, 1)
  } finally { doneCli(p, o) }
})
