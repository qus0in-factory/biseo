import test from 'node:test'
import assert from 'node:assert/strict'
import { createTurn } from '../app/create-turn.js'
import { queueEvent } from '../app/turn-queue-bind.js'
import { input, reader, agent } from '../app/turn-data-fixture.js'
import { makeDeps } from '../app/turn-fixture.js'
import { fakeWatch } from './herdr-watch-fixture.js'
import { until as wait } from '../test-wait.test-util.js'
import { startQueueWatch } from './herdr-watch-boot.js'
import { startHerdrWatch } from './herdr-watch.js'
import { logger } from './logger.js'

test('refreshes panes and reconnects after close', async () => {
  let panes = ['p1']
  let ready = 0
  const { f, subscribe } = fakeWatch()
  const w = startHerdrWatch({ listPanes: async () => panes, subscribe, onEvent: () => {}, onReady: () => ready++, baseMs: 1 })
  await wait(() => f.ids.length === 1)
  assert.deepEqual(f.ids[0], ['p1'])
  assert.equal(ready, 1)
  panes = ['p1', 'p2']
  f.events[0]!('pane.created')
  await wait(() => f.ids.length === 2)
  assert.deepEqual(f.ids[1], ['p1', 'p2'])
  assert.equal(ready, 2)
  f.closes[1]!()
  await wait(() => f.ids.length === 3)
  assert.deepEqual(f.ids[2], ['p1', 'p2'])
  assert.equal(ready, 3)
  w.stop()
  assert.ok(f.closed >= 2)
  const n = f.ids.length
  f.closes[2]!()
  await new Promise(r => setTimeout(r, 10))
  assert.equal(f.ids.length, n)
})

test('watch disabled logs one warning', () => {
  const old = logger.warn
  let n = 0
  logger.warn = ((..._a: unknown[]) => { n++ }) as typeof logger.warn
  try { startQueueWatch({ ...makeDeps(reader), allowedWorkspaceId: undefined }) }
  finally { logger.warn = old }
  assert.equal(n, 1)
})

test('server watch dispatches without SSE', async () => {
  const d = makeDeps(reader), w = { ...agent, agent_status: 'working' }
  d.herdr.listAgents = async () => [w]
  d.herdr.getAgent = async () => w
  assert.ok((await createTurn(d, input)).ok)
  let p = ''
  d.herdr.prompt = async (_, t) => { p = t }
  const { f, subscribe } = fakeWatch()
  const x = startHerdrWatch({ listPanes: async () => ['w:p1'], subscribe, onEvent: e => queueEvent(d, e) })
  await wait(() => f.events.length === 1)
  d.herdr.listAgents = async () => [agent]
  d.herdr.getAgent = async () => agent
  f.events[0]!('pane.agent_status_changed')
  await wait(() => p === 'hi')
  assert.equal(p, 'hi')
})
