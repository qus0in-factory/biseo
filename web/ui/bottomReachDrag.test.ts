import test from 'node:test'
import assert from 'node:assert/strict'
import { createBottomReach } from './bottomReach.js'

const fake = (top: number) => ({
  scrollTop: top,
  scrollHeight: 1000,
  clientHeight: 100,
  clientWidth: 200,
  offsetWidth: 220,
  getBoundingClientRect: () => ({ left: 0 }),
  scrollTo({ top }: { top: number }) { this.scrollTop = top },
})

test('a scrollbar drag during automatic scrolling triggers once', () => {
  const f = fake(0)
  const el = f as unknown as HTMLElement
  let calls = 0
  let stopped = 0
  const g = createBottomReach(() => el, () => { calls += 1 }, (e) => {
    stopped += 1
    e.scrollTo({ top: e.scrollTop })
  })
  g.init()
  g.begin()
  f.scrollTop = 840
  g.check()
  assert.equal(calls, 0)
  g.handlers.onPointerDown({ clientX: 210, target: el })
  f.scrollTop = 900
  g.check()
  g.check()
  assert.equal(stopped, 1)
  assert.equal(calls, 1)
})
