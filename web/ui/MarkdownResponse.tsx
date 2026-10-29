import { useState } from 'react'
import { MarkdownToggle } from './MarkdownToggle.js'
import { useMarkdownPlugins } from './useMarkdownPlugins.js'
import { MarkdownRawView } from './MarkdownRawView.js'
import { MarkdownRenderedView } from './MarkdownRenderedView.js'

export function MarkdownResponse({ text }: { text: string }) {
  const [raw, setRaw] = useState(false)
  const { Markdown, remarkGfm } = useMarkdownPlugins()
  const toggle = <MarkdownToggle raw={raw} onToggle={() => setRaw((v) => !v)} />

  if (raw) return <MarkdownRawView text={text} toggle={toggle} />
  if (!Markdown) {
    return (
      <div className="mt-2">
        <div className="flex justify-end">{toggle}</div>
        <p className="text-sm text-muted-foreground">마크다운 렌더링 준비 중...</p>
      </div>
    )
  }
  return <MarkdownRenderedView text={text} toggle={toggle} Markdown={Markdown} remarkGfm={remarkGfm} />
}
