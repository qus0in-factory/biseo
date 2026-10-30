import test from 'node:test'
import assert from 'node:assert/strict'
import { writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { readAgyClientIdFile, agyClientIdPath } from './agy-client-file.js'

test('a missing client file reads as null', () => {
  process.env.BISEO_AGY_CLIENT_ID_FILE = join(tmpdir(), 'agy129-no-client')
  assert.equal(readAgyClientIdFile(), null)
})

test('a present client file reads trimmed', () => {
  const p = join(tmpdir(), 'agy129-client')
  writeFileSync(p, 'synthetic-client-id\n', { mode: 0o600 })
  process.env.BISEO_AGY_CLIENT_ID_FILE = p
  assert.equal(readAgyClientIdFile(), 'synthetic-client-id')
  rmSync(p)
})

test('the default path lives under protected storage', () => {
  delete process.env.BISEO_AGY_CLIENT_ID_FILE
  assert.match(agyClientIdPath(), /\.config\/biseo\/secrets\/agy-client-id$/)
})
