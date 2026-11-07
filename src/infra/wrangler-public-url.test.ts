import test from 'node:test'
import assert from 'node:assert/strict'
import { customDomainUrl, publicBaseUrl } from './wrangler-public-url.js'

test('custom_domain route yields https base url from jsonc text', () => {
  const text = '{ // c\n "routes": [{ "pattern": "app.example.test", "custom_domain": true },], }'
  assert.equal(publicBaseUrl(text), 'https://app.example.test')
})

test('zone route, missing routes, or non-object give undefined', () => {
  assert.equal(customDomainUrl({ routes: [{ pattern: 'a.example.test/*', zone_name: 'example.test' }] }), undefined)
  assert.equal(customDomainUrl({ name: 'w' }), undefined)
  assert.equal(customDomainUrl(null), undefined)
})
