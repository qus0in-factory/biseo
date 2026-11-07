import test from 'node:test'
import assert from 'node:assert/strict'
import { parseJsonc } from '../scripts/jsonc.mjs'

test('parseJsonc drops line and block comments plus trailing commas', () => {
  const text = `{
  // line comment with https://ignored.example
  "a": 1, /* block */
  "b": [1, 2,],
}`
  assert.deepEqual(parseJsonc(text), { a: 1, b: [1, 2] })
})

test('parseJsonc keeps // inside strings intact', () => {
  assert.deepEqual(parseJsonc('{"u":"https://a.b/c" // c\n}'), { u: 'https://a.b/c' })
})
