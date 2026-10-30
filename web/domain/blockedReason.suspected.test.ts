import test from 'node:test'
import assert from 'node:assert/strict'
import { getBlockedReasonText } from './blockedReason'

test('blockedReason: suspected usage_limit shows unblockable wording', () => {
  const t = getBlockedReasonText('usage_limit', '2026-10-29T15:00:00.000Z', true)
  assert.match(t ?? '', /차단 해제 가능/)
  assert.doesNotMatch(t ?? '', /차단 해제 불가/)
})

test('blockedReason: confirmed usage_limit keeps blocked wording', () => {
  const t = getBlockedReasonText('usage_limit', '2026-10-29T15:00:00.000Z', false)
  assert.match(t ?? '', /차단 해제 불가/)
})

test('blockedReason: object suspected flag', () => {
  const t = getBlockedReasonText('usage_limit', null, { usageLimitSuspected: true })
  assert.match(t ?? '', /차단 해제 가능/)
})