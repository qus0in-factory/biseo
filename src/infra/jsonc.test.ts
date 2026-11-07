import test from 'node:test'
import assert from 'node:assert/strict'
import { parseJsonc } from './jsonc.js'

const same = (text: string) => assert.deepEqual(parseJsonc(text), JSON.parse(text))

test('drops comments and trailing commas', () => {
  const text = '{\n // c https://ignored.example\n "a": 1, /* b */\n "b": [1, 2,],\n}'
  assert.deepEqual(parseJsonc(text), { a: 1, b: [1, 2] })
})

test('keeps // inside strings intact', () => {
  assert.deepEqual(parseJsonc('{"u":"https://a.b/c" // c\n}'), { u: 'https://a.b/c' })
})

test('keeps ,} and ,] inside strings (sol P1-1)', () => {
  same('{"value":"comma,}text","list":"a,]b","next":1}')
})

test('even backslash run ends a string (sol P1-1)', () => {
  same(JSON.stringify({ path: 'x\\', url: 'https://example.test', q: 'a\\"b' }))
})

test('unterminated comment or string throws (sol P1-2)', () => {
  assert.throws(() => parseJsonc('{/* unterminated'), /unterminated block comment/)
  assert.throws(() => parseJsonc('{"a": "open'), /unterminated string/)
})
