import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'

const read = (f: string) => readFileSync(new URL(`../public/${f}`, import.meta.url))
const pngColorType = (b: Buffer) => b[25]

test('favicon PNG assets keep RGBA transparency', () => {
  for (const f of ['favicon-96x96.png', 'apple-touch-icon.png', 'web-app-manifest-192x192.png', 'web-app-manifest-512x512.png']) {
    const b = read(f)
    assert.equal(b.subarray(1, 4).toString(), 'PNG')
    assert.equal(pngColorType(b), 6, `${f} must be RGBA`)
  }
})

test('header SVG embeds an RGBA image', () => {
  const svg = read('favicon.svg').toString()
  const b64 = svg.match(/base64,([^"]+)/)?.[1]
  assert.ok(b64)
  assert.equal(pngColorType(Buffer.from(b64, 'base64')), 6)
})
