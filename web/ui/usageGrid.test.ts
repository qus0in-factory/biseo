import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const src = (f: string): string => readFileSync(new URL(f, import.meta.url), 'utf8')

test('usage grid is one column on mobile and at most two on desktop', () => {
  const grid = src('./UsageGrid.tsx')
  assert.match(grid, /grid-cols-1/)
  assert.match(grid, /md:grid-cols-2/)
  assert.doesNotMatch(grid, /grid-cols-3|lg:grid-cols/)
  assert.match(grid, /items-start/)
  assert.match(grid, /min-w-0/)
})

test('dashboard renders every window without the three-row summary cap', () => {
  const dash = src('./UsageDashboardContent.tsx')
  assert.match(dash, /<UsageGrid>/)
  assert.match(dash, /providers\.map/)
  assert.doesNotMatch(dash, /summary/)
  const body = src('./UsagePanelBody.tsx')
  assert.doesNotMatch(body, /SUMMARY_ROWS|slice\(0/)
  assert.match(body, /provider\.windows\.map/)
  assert.match(body, /rows\.map/)
})
