import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'

const p = (f: string) => new URL(f, import.meta.url)
const s = (f: string) => readFileSync(p(f), 'utf8')

test('bottom auto execution is gone', () => {
  const gone = [
    './scrollReset.ts',
    './useScrollReset.ts',
    './useTimelineReset.ts',
    './useBottomReached.ts',
    './bottomReach.ts',
    './scrollGesture.ts',
  ]
  for (const f of gone) assert.ok(!existsSync(p(f)), f)
})

test('the timeline has no bottom callback', () => {
  const files = [
    './TimelineScrollBody.tsx',
    './useTimelineScroll.ts',
    './useAutoScroll.ts',
    './dashboardTypes.ts',
  ]
  for (const f of files) assert.doesNotMatch(s(f), /onReachBottom|useBottomReached/)
})

test('auto scroll and jump stay', () => {
  const a = s('./useAutoScroll.ts')
  assert.match(a, /planScroll\(prevRef\.current, items, near\)/)
  assert.match(a, /scrollDown\(ref\.current\)/)
  assert.match(s('./TimelineScrollBody.tsx'), /showJump && <JumpToBottomButton/)
})
