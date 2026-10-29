import { useEffect, useState } from 'react'
import { PELE_STYLE } from './peleStyle.js'
import { renderMermaid } from './renderMermaid.js'
import { MermaidFallback } from './MermaidFallback.js'

export function MermaidBlock({ source }: { source: string }) {
  const [svg, setSvg] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    renderMermaid(source)
      .then((s) => !cancelled && setSvg(s))
      .catch(() => !cancelled && setFailed(true))
    return () => {
      cancelled = true
    }
  }, [source])

  if (failed) return <MermaidFallback source={source} />
  if (!svg) return <p className="text-sm text-muted-foreground">다이어그램 렌더링 중...</p>
  return (
    <div
      className="pele-scope mt-2 overflow-x-auto"
      style={PELE_STYLE}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
