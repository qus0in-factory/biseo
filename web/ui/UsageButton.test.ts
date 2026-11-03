import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'

const src = (f: string) => readFileSync(new URL(f, new URL("../app/usageIntervalMount.test.ts", import.meta.url).href), 'utf8')

test('useUsageInterval separates mount lifetime from enabled interval', () => {
  const code = src('./useUsageInterval.ts')
  assert.match(code, /live\.current = false/)
  assert.match(code, /clearInterval\(t\)/)
})

test('useUsageState uses cached providers when available to prevent stuck loading', () => {
  const code = src('./useUsageState.ts')
  assert.match(code, /useUsageStore\.getState\(\)\.providers/)
  assert.match(code, /cached\.length \? readyState\(cached\) : loadingState\(\)/)
})

test('UsageButton ensures UsageModal is enabled while open', () => {
  assert.match(src('../ui/UsageButton.tsx'), /<UsageModal open=\{open\} onClose=\{[^}]+\} enabled=\{open\} \/>/)
})
