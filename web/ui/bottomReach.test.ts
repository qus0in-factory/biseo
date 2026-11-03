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

test('non-scroll pointer and key input keep automatic scrolling protected', () => {
  const f = fake(0)
  const el = f as unknown as HTMLElement
  let calls = 0
  const g = createBottomReach(() => el, () => { calls += 1 })
  g.init()
  g.begin()
  g.handlers.onPointerDown({ clientX: 100, target: el })
  g.handlers.onPointerDown({ clientX: 210, target: {} as EventTarget })
  g.handlers.onKeyDown({ key: 'a' })
  f.scrollTop = 840
  g.check()
  f.scrollTop = 900
  g.check()
  assert.equal(calls, 0)
})

test('a user scroll from above still triggers once', () => {
  const f = fake(0)
  let calls = 0
  const g = createBottomReach(() => f as unknown as HTMLElement, () => { calls += 1 })
  g.init()
  f.scrollTop = 900
  g.check()
  g.check()
  assert.equal(calls, 1)
})
