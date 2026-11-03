import assert from 'node:assert/strict'
import test from 'node:test'
import { isOriginAllowed } from '../domain/origin-guard.js'

const LIST = 'https://biseo.qus0in.workers.dev,https://biseo.qus0in.dev'

test('same origin allowed', () => {
  assert.equal(isOriginAllowed('https://biseo.qus0in.dev/api/x', 'https://biseo.qus0in.dev', 'https://biseo.qus0in.workers.dev'), true)
})

test('both domains allowed', () => {
  assert.equal(isOriginAllowed('https://biseo.qus0in.workers.dev/api/x', 'https://biseo.qus0in.workers.dev', LIST), true)
  assert.equal(isOriginAllowed('https://biseo.qus0in.dev/api/x', 'https://biseo.qus0in.dev', LIST), true)
})

test('listed cross origin allowed', () => {
  assert.equal(isOriginAllowed('https://biseo.qus0in.dev/api/x', 'https://biseo.qus0in.workers.dev', LIST), true)
})

test('empty list allows same origin', () => {
  assert.equal(isOriginAllowed('https://biseo.qus0in.dev/api/x', 'https://biseo.qus0in.dev', ''), true)
})

test('unlisted denied', () => {
  assert.equal(isOriginAllowed('https://biseo.qus0in.dev/api/x', 'https://evil.test', LIST), false)
})

test('missing origin denied', () => {
  assert.equal(isOriginAllowed('https://biseo.qus0in.dev/api/x', undefined, LIST), false)
})

test('malformed denied', () => {
  assert.equal(isOriginAllowed('https://biseo.qus0in.dev/api/x', 'not-a-url', LIST), false)
})

test('empty list denies cross origin', () => {
  assert.equal(isOriginAllowed('https://biseo.qus0in.dev/api/x', 'https://biseo.qus0in.workers.dev', ''), false)
})

test('empty list denies missing origin', () => {
  assert.equal(isOriginAllowed('https://biseo.qus0in.dev/api/x', undefined, ''), false)
})
