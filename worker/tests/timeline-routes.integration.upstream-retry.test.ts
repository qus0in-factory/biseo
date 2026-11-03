import test from'node:test'
import{retries5xx,givesUp}from '../test-util/upstream-retry-5xx-cases.js'
import{retriesNetwork}from '../test-util/upstream-retry-network-case.js'
test('GET retries 5xx then succeeds',retries5xx)
test('GET gives up after max 5xx attempts',givesUp)
test('GET retries network error then succeeds',retriesNetwork)
