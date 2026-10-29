import test from 'node:test'
import assert from 'node:assert/strict'
import { codexResponse } from './codex-response.js'
import { j, user, done } from './codex-response-fixture.js'

test('returns task_complete after the first matching user; begin offset excludes earlier turns', () => {
 const raw = [done('before'), user('  hi  '), j({ type: 'response_item', payload: { type: 'message', role: 'assistant', content: [{ type: 'output_text', text: 'partial' }] } }), done(' final '), user('next'), done('wrong')].join('\n')
 assert.equal(codexResponse(raw, 'hi'), 'final')
})

test('stops at next user before completion', () => {
 const raw = [user('hi'), user('next'), done('late')].join('\n')
 assert.equal(codexResponse(raw, 'hi'), null)
})