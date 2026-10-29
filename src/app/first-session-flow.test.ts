import test from 'node:test'
import assert from 'node:assert/strict'
import { captureTurn } from './capture-turn.js'
import { beginFirstReader } from './first-session-reader.js'
import { TurnStore } from './turn-store.js'
import { noSub, pane } from './first-session-fixture.js'
import { captureHerdr, captureItem } from './first-session-capture-fixture.js'

test('missing session ends capture_unavailable with one prompt', async () => {
  const t = { pane }
  let n = 0
  const herdr = captureHerdr(() => { n++ })
  const store = new TurnStore()
  store.add({ ...captureItem })
  const r = beginFirstReader({ herdr: herdr as never, firstSessionMs: 20, sub: noSub }, t, 'hi')!
  await captureTurn({ herdr: herdr as never, store, timeoutMs: 500, lateCaptureMs: 0 }, captureItem, r)
  assert.equal(store.get('r1')?.status, 'capture_unavailable')
  assert.equal(store.get('r1')?.errorCode, 'response_capture_unavailable')
  assert.equal(n, 1)
})
