import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { UsagePanelBody } from './UsagePanelBody.js'
import type { UsageProvider } from '../domain/usage.js'

test('metric rows retain order and label only exhausted rows', () => {
  const metrics = [50, 0, 20].map((remaining, i) => ({
    id: `row${i}`, label: `row${i}`, unit: 'credits',
    used: null, limit: null, remaining, resetsAt: null,
  }))
  const provider: UsageProvider = { provider: 'test', state: 'limited', windows: [], metrics }
  const html = renderToStaticMarkup(createElement(UsagePanelBody, { provider }))
  assert.ok(html.indexOf('row0') < html.indexOf('row1'))
  assert.ok(html.indexOf('row1') < html.indexOf('row2'))
  assert.equal((html.match(/sr-only/g) ?? []).length, 1)
  assert.equal((html.match(/text-danger/g) ?? []).length, 1)
  assert.doesNotMatch(html, /text-error/)
  assert.equal((html.match(/truncate text-xs text-muted-foreground/g) ?? []).length, 3)
  assert.doesNotMatch(html, /border-t|border-border/)
  assert.match(html, /한도 도달/)
})
