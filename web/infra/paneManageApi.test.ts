import test from 'node:test'
import assert from 'node:assert/strict'
import { paneManageApi } from './paneManageApi'
import { PaneCloseError } from '../domain/paneCloseError'
import { fakeHttp } from '../test-util/fakeHttp'

test('pane management encodes IDs and sends each method/body with same-origin credentials', async t => {
  const requests = fakeHttp(t, req => req.method === 'POST' && new URL(req.url).pathname === '/api/panes'
    ? Response.json({ paneId: 'new-pane', ignored: true }) : new Response(null, { status: 204 }))
  assert.deepEqual(await paneManageApi.openPane({ templateId: 'tpl', name: 'Desk' }), { paneId: 'new-pane' })
  await paneManageApi.renamePane('a/b ?#', 'Renamed')
  await paneManageApi.closePane('a/b ?#')
  assert.deepEqual(requests.map(r => [r.method, new URL(r.url).pathname, r.credentials]), [
    ['POST', '/api/panes', 'same-origin'],
    ['POST', '/api/panes/a%2Fb%20%3F%23/rename', 'same-origin'],
    ['DELETE', '/api/panes/a%2Fb%20%3F%23', 'same-origin'],
  ])
  assert.deepEqual(await requests[0].json(), { templateId: 'tpl', name: 'Desk' })
  assert.deepEqual(await requests[1].json(), { name: 'Renamed' })
  assert.equal(await requests[2].text(), '')
})

test('close translates server error codes and malformed/network failures to PaneCloseError', async t => {
  let response = () => Response.json({ error: 'pane_busy' }, { status: 409 })
  const requests = fakeHttp(t, () => response())
  const expected = (code: string | null) => (e: unknown) => e instanceof PaneCloseError && e.code === code
  await assert.rejects(paneManageApi.closePane('p'), expected('pane_busy'))
  response = () => Response.json({ error: 123 }, { status: 500 })
  await assert.rejects(paneManageApi.closePane('p'), expected(null))
  response = () => new Response('not json', { status: 502 })
  await assert.rejects(paneManageApi.closePane('p'), expected(null))
  response = () => { throw new TypeError('offline') }
  await assert.rejects(paneManageApi.closePane('p'), expected(null))
  assert.equal(requests.length, 4)
})

test('open and rename propagate HTTP errors without retrying or returning success', async t => {
  const requests = fakeHttp(t, () => Response.json({ error: 'unavailable' }, { status: 503 }))
  const expected = (e: unknown) => (e as { response?: Response }).response?.status === 503
  await assert.rejects(paneManageApi.openPane({}), expected)
  await assert.rejects(paneManageApi.renamePane('p', 'name'), expected)
  assert.equal(requests.length, 2)
})
