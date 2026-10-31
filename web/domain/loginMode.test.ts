import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { parseLoginMode, restoreLoginMode, saveLoginMode } from './loginMode'

describe('loginMode domain', () => {
  it('parses modes and falls back for damaged values', () => {
    assert.equal(parseLoginMode('pin'), 'pin')
    assert.equal(parseLoginMode('password'), 'password')
    for (const v of [null, undefined, '', 'bad', 1, {}]) {
      assert.equal(parseLoginMode(v), 'password')
    }
  })

  it('restores or saves mode with fallback', () => {
    const s = { d: { k: 'pin' } as Record<string, string>,
      getItem: (k: string) => s.d[k] ?? null,
      setItem: (k: string, v: string) => { s.d[k] = v } }
    assert.equal(restoreLoginMode(s, 'k'), 'pin')
    assert.equal(restoreLoginMode(null, 'k'), 'password')
    assert.equal(restoreLoginMode({ getItem() { throw 0 } }, 'k'), 'password')
    saveLoginMode(s, 'k', 'password')
    assert.equal(s.d.k, 'password')
  })
})
