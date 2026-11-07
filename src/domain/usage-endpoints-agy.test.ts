import test from 'node:test'
import assert from 'node:assert/strict'
import { getAgyEndpoints } from './usage-endpoints-agy.js'

const e = process.env
const keys = ['BISEO_AGY_HOST', 'BISEO_AGY_USAGE_URL', 'BISEO_AGY_QUOTA_URL'] as const
const saved = Object.fromEntries(keys.map((k) => [k, e[k]]))
test.afterEach(() => keys.forEach((k) => (saved[k] === undefined ? delete e[k] : (e[k] = saved[k]))))

test('기본 호스트는 daily 호스트다', () => {
  keys.forEach((k) => delete e[k])
  const u = getAgyEndpoints()
  assert.equal(u.agy, 'https://daily-cloudcode-pa.googleapis.com/v1internal:retrieveUserQuotaSummary')
  assert.equal(u.agyQuota, 'https://daily-cloudcode-pa.googleapis.com/v1internal:retrieveUserQuota')
})

test('BISEO_AGY_HOST 끝 슬래시 제거와 URL 우선', () => {
  e.BISEO_AGY_HOST = 'http://h.test///'
  e.BISEO_AGY_QUOTA_URL = 'http://q.test/x'
  const u = getAgyEndpoints()
  assert.equal(u.agy, 'http://h.test/v1internal:retrieveUserQuotaSummary')
  assert.equal(u.agyQuota, 'http://q.test/x')
})
