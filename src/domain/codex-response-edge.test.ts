import test from 'node:test'
import assert from 'node:assert/strict'
import { codexResponse } from './codex-response.js'
import { j, user, done } from './codex-response-fixture.js'

test('requires a matching user prompt', () => {
 const raw = [user('other'), done('answer')].join('\n')
 assert.equal(codexResponse(raw, 'hi'), null)
})

test('ignores broken lines and missing message text', () => {
 const raw = ['not json', j({ type: 'response_item', payload: { type: 'message', role: 'user', content: [] } }), user('hi'), done('ok')].join('\n')
 assert.equal(codexResponse(raw, 'hi'), 'ok')
})