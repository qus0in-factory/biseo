import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'

const src = (f: string) => readFileSync(new URL(f, import.meta.url), 'utf8')

test('usage dashboard waits for AsyncList before showing the empty text', () => {
  const body = src('./UsageModalBody.tsx')
  assert.match(body, /state=\{state\}/)
  assert.match(body, /retry=\{retry\}/)
  const asyncDash = src('./UsageDashboardAsync.tsx')
  assert.match(asyncDash, /<AsyncList/)
  assert.match(asyncDash, /onRetry=\{retry\}/)
  assert.match(asyncDash, /r\.usageEmpty/)
  assert.match(src('./UsageDashboardContent.tsx'), /UsagePanelRow/)
})

test('usage dashboard and settings use provider types instead of any', () => {
  for (const f of ['./UsageDashboard.tsx', './UsageDashboardAsync.tsx', './UsageProviderSettings.tsx']) {
    assert.doesNotMatch(src(f), /\bany\b/)
  }
})
