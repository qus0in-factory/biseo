import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { shouldSendOnEnter } from './composerKey.js'
import type { KeyboardEvent } from 'react'

function mockKey(
  key: string,
  shiftKey = false,
  isComposing = false,
): KeyboardEvent<HTMLTextAreaElement> {
  return {
    key,
    shiftKey,
    nativeEvent: { isComposing } as unknown as Event,
  } as unknown as KeyboardEvent<HTMLTextAreaElement>
}

describe('composerKey', () => {
  it('allows send on Enter on desktop', () => {
    assert.equal(shouldSendOnEnter(mockKey('Enter'), false), true)
  })

  it('prevents send on Shift+Enter', () => {
    assert.equal(shouldSendOnEnter(mockKey('Enter', true), false), false)
  })

  it('ignores Enter during IME composition', () => {
    assert.equal(shouldSendOnEnter(mockKey('Enter', false, true), false), false)
  })

  it('allows newline on mobile Enter', () => {
    assert.equal(shouldSendOnEnter(mockKey('Enter'), true), false)
  })
})
