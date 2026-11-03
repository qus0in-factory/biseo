import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
test('header keeps the status icon secondary and gives actions a hover surface', () => {
  const src = readFileSync(new URL('./UsagePanelHeader.tsx', import.meta.url), 'utf8')
  assert.match(src, /gap-2/)
  const status = readFileSync(new URL('./UsageHeaderStatus.tsx', import.meta.url), 'utf8')
  assert.match(status, /size=\{14\}/)
  assert.match(status, /\[&_button:hover\]:bg-muted/)
  const name = readFileSync(new URL('./UsageProviderName.tsx', import.meta.url), 'utf8')
  assert.match(name, /truncate/)
  assert.match(name, /ModelIcon/)
})
