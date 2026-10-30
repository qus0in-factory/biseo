import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'

test('light-only head metadata and manifest colors', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8')
  assert.match(html, /name="color-scheme" content="light"/)
  assert.doesNotMatch(html, /prefers-color-scheme/)
  const manifest = JSON.parse(readFileSync(new URL('../public/site.webmanifest', import.meta.url), 'utf8'))
  assert.equal(manifest.theme_color, '#F4F7F5')
  assert.equal(manifest.background_color, '#F4F7F5')
})
