import assert from 'node:assert/strict'
import test from 'node:test'
import { olderFixture } from '../test-util/olderTestFixture'

for (const fail of [false, true]) {
  test(`old older ${fail ? 'reject' : 'resolve'} preserves current guards`, async () => {
    const f = olderFixture(), r = f.r
    const old = f.run()
    r.gen.current++
    r.w = 'B'
    r.paneId = 'pB'
    r.loading.current = false
    r.requested.current = null
    const current = f.run()
    if (fail) f.requests[0].reject(Error('old'))
    else f.requests[0].resolve(f.page)
    assert.equal(await old, null)
    assert.equal(r.loading.current, true)
    assert.equal(r.requested.current, 10)
    assert.equal(f.updates(), 0)
    assert.equal(await f.run(), null)
    assert.equal(f.requests.length, 2)
    f.requests[1].resolve(f.page)
    assert.equal(await current, f.page)
    assert.equal(r.loading.current, false)
    assert.equal(f.updates(), 1)
  })
}
