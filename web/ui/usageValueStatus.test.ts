import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { UsageValueStatus } from './UsageValueStatus'

test('warning boundaries use token, icon and accessible text; 100 is danger', () => {
  for (const [window, threshold] of [['primary', 90], ['secondary', 98], ['monthly', 98]] as const) {
    for (const used of [threshold - 1, threshold, 99, 100]) {
      const html = renderToStaticMarkup(createElement(UsageValueStatus, { text: `${used}%`, window, used }))
      assert.equal(html.includes('text-danger'), used === 100)
      assert.equal(html.includes('text-warning'), used >= threshold && used < 100)
      assert.equal(html.includes('lucide-triangle-alert'), used >= threshold)
      assert.equal(html.includes('sr-only'), used >= threshold)
    }
  }
})
