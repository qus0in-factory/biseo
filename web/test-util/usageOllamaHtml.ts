import type { UsageMetric } from '../domain/usage.js'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { UsagePanelBody } from '../ui/UsagePanelBody.js'
import type { UsageProvider } from '../domain/usage.js'

export const html = (provider: string, metrics: UsageMetric[], remaining = true): string => {
  const p: UsageProvider = { provider, state: 'available', windows: [], metrics }
  return renderToStaticMarkup(createElement(UsagePanelBody, { provider: p, remaining }))
}
