import { describe, it } from 'node:test'
import a from 'node:assert/strict'
import { clampCollapsedCount, selectCollapsedPanes } from './collapsedPanes.js'

describe('collapsedPanes', () => {
  it('정상 및 범위 밖 clamp', () => {
    a.equal(clampCollapsedCount(2, 1, 3, 3), 2)
    a.equal(clampCollapsedCount('2'), 2)
    a.equal(clampCollapsedCount(0, 1, 3, 3), 1)
    a.equal(clampCollapsedCount(-5, 1, 3, 3), 1)
    a.equal(clampCollapsedCount(4), 3)
    a.equal(clampCollapsedCount('5', 1, 3, 3), 3)
  })

  it('손상값 fallback', () => {
    for (const v of [null, undefined, 'x', '', NaN, 2.5, {}, true]) {
      a.equal(clampCollapsedCount(v, 1, 3, 3), 3)
    }
  })

  it('패널 부족 및 고정 초과 N 상한', () => {
    a.deepEqual(selectCollapsedPanes(['a'], 3), ['a'])
    a.deepEqual(selectCollapsedPanes([], 3), [])
    const p = ['p1', 'p2', 'p3', 'p4', 'r1']
    a.deepEqual(selectCollapsedPanes(p, 3), ['p1', 'p2', 'p3'])
    a.deepEqual(selectCollapsedPanes(p, 2), ['p1', 'p2'])
  })
})
