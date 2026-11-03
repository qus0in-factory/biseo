import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const src = (f: string): string => readFileSync(new URL(f, import.meta.url), 'utf8')

test('usage grid is 1/2/3 columns and top aligned', () => {
  const grid = src('./UsageGrid.tsx')
  assert.match(grid, /grid-cols-1/)
  assert.match(grid, /md:grid-cols-2/)
  assert.match(grid, /lg:grid-cols-3/)
  assert.match(grid, /items-start/)
  assert.match(grid, /min-w-0/)
})

test('bookmark grid replaces flex wrap and summarizes rows', () => {
  const tabs = src('./UsageTabContent.tsx')
  assert.match(tabs, /<UsageGrid>/)
  assert.doesNotMatch(tabs, /flex flex-wrap/)
  assert.match(tabs, /summary/)
  const body = src('./UsagePanelBody.tsx')
  assert.match(body, /SUMMARY_ROWS = 3/)
  assert.match(body, /slice\(0, SUMMARY_ROWS\)/)
})

test('usage cards keep one outer border and no fixed minimum width', () => {
  const row = src('./UsagePanelRow.tsx')
  assert.match(row, /<Card/)
  assert.match(row, /self-start/)
  assert.match(row, /min-w-0/)
  assert.doesNotMatch(row, /min-w-44/)
  assert.doesNotMatch(row, /h-full/)
})
