import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const src = (f: string) => readFileSync(new URL(f, import.meta.url), 'utf8')

test('the timeline body wires every user scroll handler', () => {
  const body = src('./TimelineScrollBody.tsx')
  assert.match(body, /\.\.\.onUserScroll/)
  assert.doesNotMatch(body, /onTouchStart/)
  assert.match(src('./useAutoScroll.ts'), /onUserScroll: g\.handlers/)
})

test('tap-like touch starts and unrelated keys do not arm the gesture', () => {
  const gesture = src('./scrollGesture.ts')
  assert.doesNotMatch(gesture, /onTouchStart/)
  assert.match(gesture, /'ArrowDown'[\s\S]*'PageDown'[\s\S]*'Home'[\s\S]*'End'/)
  assert.match(gesture, /e\.target !== el/)
})
