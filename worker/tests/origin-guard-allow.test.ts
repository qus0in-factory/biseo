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
