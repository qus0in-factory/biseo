import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { UsagePanelBody } from '../ui/UsagePanelBody.js'
import type { UsageProvider } from '../domain/usage.js'
export function exhaustedPanelHtml() {
  const metrics = [50, 0, 20].map((remaining, i) => ({ id: `row${i}`, label: `row${i}`, unit: 'credits' as const, used: null, limit: null, remaining, resetsAt: null }))
  const provider: UsageProvider = { provider: 'test', state: 'limited', windows: [], metrics }
  return renderToStaticMarkup(createElement(UsagePanelBody, { provider }))
}
