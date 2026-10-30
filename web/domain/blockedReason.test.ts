import test from 'node:test'
import assert from 'node:assert/strict'
import { getBlockedReasonText } from './blockedReason'

test('blockedReason: usage_limit with reset time', () => {
  const t = getBlockedReasonText('usage_limit', '2026-10-29T15:00:00.000Z')
  assert.match(t ?? '', /2026-10-29 15:00Z/)
  assert.match(t ?? '', /차단 해제 불가/)
})

test('blockedReason: usage_limit without reset time', () => {
  const t = getBlockedReasonText('usage_limit', null)
  assert.match(t ?? '', /재개 시각 미확인/)
})

test('blockedReason: input_request and unknown', () => {
  const a = getBlockedReasonText('input_request')
  assert.match(a ?? '', /승인 또는 입력 대기/)
  const s = getBlockedReasonText('unknown')
  assert.match(s ?? '', /미확인|추정/)
})

test('blockedReason: null returns null', () => {
  assert.equal(getBlockedReasonText(undefined), null)
})
