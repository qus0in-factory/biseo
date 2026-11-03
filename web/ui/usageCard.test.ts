import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const src = (f: string): string => readFileSync(new URL(f, import.meta.url), 'utf8')

test('usage cards keep one outer border and no fixed minimum width', () => {
  const row = src('./UsagePanelRow.tsx')
  assert.match(row, /<Card/)
  assert.match(row, /self-start/)
  assert.match(row, /min-w-0/)
  assert.doesNotMatch(row, /min-w-44/)
  assert.doesNotMatch(row, /h-full/)
})
