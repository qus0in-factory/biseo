import assert from 'node:assert/strict'
import test from 'node:test'
import { isOriginAllowed } from '../domain/origin-guard.js'

const LIST = 'https://biseo.qus0in.workers.dev,https://biseo.qus0in.dev'

test('allows same origin even when allowlist omits it', () => {
  assert.equal(
    isOriginAllowed('https://biseo.qus0in.dev/api/x', 'https://biseo.qus0in.dev', 'https://biseo.qus0in.workers.dev'),
    true,
  )
})

test('allows both configured domains', () => {
  assert.equal(isOriginAllowed('https://biseo.qus0in.workers.dev/api/x', 'https://biseo.qus0in.workers.dev', LIST), true)
  assert.equal(isOriginAllowed('https://biseo.qus0in.dev/api/x', 'https://biseo.qus0in.dev', LIST), true)
})

test('allows a listed cross origin', () => {
  assert.equal(isOriginAllowed('https://biseo.qus0in.dev/api/x', 'https://biseo.qus0in.workers.dev', LIST), true)
})

test('denies unlisted cross origin', () => {
  assert.equal(isOriginAllowed('https://biseo.qus0in.dev/api/x', 'https://evil.test', LIST), false)
})

test('denies missing origin', () => {
  assert.equal(isOriginAllowed('https://biseo.qus0in.dev/api/x', undefined, LIST), false)
})

test('denies malformed origin', () => {
  assert.equal(isOriginAllowed('https://biseo.qus0in.dev/api/x', 'not-a-url', LIST), false)
})
