import test from 'node:test'
import assert from 'node:assert/strict'
import { importFromUpstream } from '../ui/timeline-import-upstream.js'
import { queueFixture } from '../test-util/queue-fixture.js'

test('upstream fallback cannot expose an existing turn outside read scope', async () => {
  const { db, put } = await queueFixture()
  await put('private')
  const upstream = { getTurn: async () => { throw new Error('scope bypass') } }
  for (const [workspace, owner] of [['w', 'other'], ['other', 'o']]) {
    assert.equal(await importFromUpstream(db, upstream as any, 'private', workspace, owner), null)
  }
})
