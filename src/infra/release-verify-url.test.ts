import test from 'node:test'
import assert from 'node:assert/strict'
import { ENV_KEY, resolveVerifyUrl } from './release-verify-url.js'

const wranglerText = '{ // c\n "routes": [{ "pattern": "app.example.test", "custom_domain": true },], }'
const fileUrl = 'https://file.example.test'

test('env url wins over file and wrangler', () => {
  const env = { [ENV_KEY]: 'https://env.example.test' }
  assert.equal(resolveVerifyUrl({ env, fileUrl, wranglerText }), env[ENV_KEY])
})

test('file url wins over wrangler custom domain', () => {
  assert.equal(resolveVerifyUrl({ fileUrl, wranglerText }), fileUrl)
})

test('wrangler custom domain yields https url', () => {
  assert.equal(resolveVerifyUrl({ wranglerText }), 'https://app.example.test')
})

test('zone route or no source gives undefined', () => {
  const plain = '{"routes":[{"pattern":"a.example.test/*","zone_name":"example.test"}]}'
  assert.equal(resolveVerifyUrl({ wranglerText: plain }), undefined)
  assert.equal(resolveVerifyUrl({}), undefined)
})
