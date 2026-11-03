import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const src = (f: string): string => readFileSync(new URL(f, import.meta.url), 'utf8')

test('usage cards flow into one mobile, two tablet and three desktop columns', () => {
  const grid = src('./UsageGrid.tsx')
  assert.match(grid, /columns-1/)
  assert.match(grid, /md:columns-2/)
  assert.match(grid, /xl:columns-3/)
  assert.match(grid, /\[column-fill:balance\]/)
  assert.match(grid, /break-inside-avoid/)
  assert.match(grid, /gap-3/)
  assert.doesNotMatch(grid, /lg:columns-3|columns-4|grid-cols/)
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
