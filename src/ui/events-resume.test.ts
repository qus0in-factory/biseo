import assert from 'node:assert/strict'
import test from 'node:test'
import { Hono } from 'hono'
import { runSse } from './events-sse.js'
import { Wake } from './wake.js'
import { deps, readFor } from './events-resume-helpers.js'

for (const last of [undefined, '7']) {
  test(`runSse snapshot carries retry${last ? ` and resumed marker for lastId ${last}` : ''}`, async () => {
    const app = new Hono()
    app.get('/ev', (c) => runSse(c, deps(), 'w', () => {}, new Wake(), last))
    const res = await app.request('/ev')
    assert.equal(res.status, 200)
    try {
      const text = await readFor(res.body, /pane\.updated/)
      assert.match(text, /event: pane\.updated/)
      assert.match(text, /retry: 3000/)
      if (last) assert.match(text, /"resumedFrom":"7"/)
      else assert.doesNotMatch(text, /resumedFrom/)
    } finally {
      await res.body?.cancel()
    }
  })
}
