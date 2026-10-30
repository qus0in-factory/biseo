import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { UsagePanelBody } from './UsagePanelBody.js'
import type { UsageMetric, UsageProvider } from '../domain/usage.js'

export const html = (provider: string, metrics: UsageMetric[]): string => {
  const p: UsageProvider = { provider, state: 'available', windows: [], metrics }
  return renderToStaticMarkup(createElement(UsagePanelBody, { provider: p }))
}
