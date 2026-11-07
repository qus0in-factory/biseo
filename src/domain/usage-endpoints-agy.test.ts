import test from 'node:test'
import assert from 'node:assert/strict'
import { getAgyEndpoints } from './usage-endpoints-agy.js'

const keys = ['BISEO_AGY_HOST', 'BISEO_AGY_USAGE_URL', 'BISEO_AGY_QUOTA_URL'] as const
const saved = Object.fromEntries(keys.map((k) => [k, process.env[k]]))
test.afterEach(() => keys.forEach((k) => (saved[k] === undefined ? delete process.env[k] : (process.env[k] = saved[k]))))

test('기본 호스트는 agy CLI와 같은 daily 호스트다', () => {
  keys.forEach((k) => delete process.env[k])
  const u = getAgyEndpoints()
  assert.match(u.agy, /^https:\/\/daily-cloudcode-pa\.googleapis\.com\/v1internal:retrieveUserQuotaSummary$/)
  assert.match(u.agyQuota, /^https:\/\/daily-cloudcode-pa\.googleapis\.com\/v1internal:retrieveUserQuota$/)
})

test('BISEO_AGY_HOST로 호스트를 바꾸고 URL 설정이 우선한다', () => {
  process.env.BISEO_AGY_HOST = 'http://h.test'
  process.env.BISEO_AGY_QUOTA_URL = 'http://q.test/x'
  const u = getAgyEndpoints()
  assert.equal(u.agy, 'http://h.test/v1internal:retrieveUserQuotaSummary')
  assert.equal(u.agyQuota, 'http://q.test/x')
})
