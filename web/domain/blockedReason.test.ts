import test from 'node:test'
import assert from 'node:assert/strict'
import { getBlockedReasonText } from './blockedReason'

test('blockedReason: usage_limited with reset time', () => {
  const t = getBlockedReasonText('usage_limited', '2026-10-29T15:00:00.000Z')
  assert.match(t ?? '', /2026-10-29 15:00Z/)
  assert.match(t ?? '', /차단 해제 불가/)
})

test('blockedReason: usage_limited without reset time', () => {
  const t = getBlockedReasonText('usage_limited', null)
  assert.match(t ?? '', /재개 시각 미확인/)
})

test('blockedReason: awaiting_input and suspected_limit', () => {
  const a = getBlockedReasonText('awaiting_input')
  assert.match(a ?? '', /승인 또는 입력 대기/)
  const s = getBlockedReasonText('suspected_limit')
  assert.match(s ?? '', /추정/)
  assert.doesNotMatch(s ?? '', /차단 해제 불가/)
})

test('blockedReason: null returns null', () => {
  assert.equal(getBlockedReasonText(undefined), null)
})
