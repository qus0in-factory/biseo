import { useEffect, useState } from "react"
import type React from "react"
import { sanitizeSvg } from './sanitizeSvg.js'

const PELE_STYLE = {
  '--_bg': 'var(--background, #ffffff)',
  '--_s': 'var(--surface, #f8fafc)',
  '--_a': 'var(--muted, #e2e8f0)',
  '--_b': 'var(--border, #cbd5e1)',
  '--_c': 'var(--primary, #2563eb)',
  '--_m': 'var(--muted-foreground, #64748b)',
  '--_l': 'var(--foreground, #0f172a)',
  '--_fg': 'var(--foreground, #0f172a)',
  '--_tw': '600',
  '--_hw': '700',
} as React.CSSProperties

export function MermaidBlock({ source }: { source: string }) {
  const [svg, setSvg] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [peleMod, dompurifyMod] = await Promise.all([
          import('pele/lazy'),
          import('dompurify'),
        ])
        const renderAsync = (peleMod as { renderAsync: (text: string, options?: Record<string, unknown>) => Promise<{ svg: string }> }).renderAsync
        const result = await renderAsync(source, { fontSize: 14, responsive: true })
        if (cancelled) return
        const purify = (dompurifyMod as { default?: { sanitize: (input: string, cfg?: Record<string, unknown>) => string } }).default
        const cleaned = purify?.sanitize
          ? purify.sanitize(result.svg, { USE_PROFILES: { svg: true, svgFilters: true } })
          : result.svg
        setSvg(sanitizeSvg(cleaned))
      } catch {
        if (!cancelled) setFailed(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [source])

  if (failed) {
    return (
      <pre className="mt-2 overflow-x-auto border-l-[3px] border-l-primary bg-surface p-2 font-mono whitespace-pre-wrap break-words">
        <code>{source}</code>
      </pre>
    )
  }
  if (!svg) {
    return <p className="text-sm text-muted-foreground">다이어그램 렌더링 중...</p>
  }
  return (
    <div
      className="pele-scope mt-2 overflow-x-auto"
      style={PELE_STYLE}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
