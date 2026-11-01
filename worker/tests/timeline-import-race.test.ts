import test from 'node:test'
import assert from 'node:assert/strict'
import { importFromUpstream } from '../ui/timeline-import-upstream.js'
import { queueFixture } from './queue-fixture.js'
import { findTurn } from '../infra/d1-timeline-find.js'
import { toItem } from '../app/timeline-map.js'

test('concurrent import cannot return an existing row owned by another subject', async () => {
  const { db, put } = await queueFixture()
  const upstream = { getTurn: async () => {
    await put('race')
    const row = (await findTurn(db, { workspaceId: 'w', ownerSubject: 'o' }, 'race'))!
    return { ok: true, data: toItem(row) }
  } }
  assert.equal(await importFromUpstream(db, upstream as any, 'race', 'w', 'other'), null)
})
