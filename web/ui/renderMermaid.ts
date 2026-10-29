import { sanitizeSvg } from './sanitizeSvg.js'

export async function renderMermaid(source: string): Promise<string> {
  const [peleMod, dompurifyMod] = await Promise.all([
    import('pele/lazy'),
    import('dompurify'),
  ])
  const renderAsync = (peleMod as {
    renderAsync: (text: string, options?: Record<string, unknown>) => Promise<{ svg: string }>
  }).renderAsync
  const result = await renderAsync(source, { fontSize: 14, responsive: true })
  const purify = (dompurifyMod as {
    default?: { sanitize: (input: string, cfg?: Record<string, unknown>) => string }
  }).default
  const cleaned = purify?.sanitize
    ? purify.sanitize(result.svg, { USE_PROFILES: { svg: true, svgFilters: true } })
    : result.svg
  return sanitizeSvg(cleaned)
}
