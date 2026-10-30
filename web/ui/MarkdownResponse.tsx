import { useState } from 'react'
import { MarkdownToggle } from './MarkdownToggle.js'
import { useMarkdownPlugins } from './useMarkdownPlugins.js'
import { MarkdownRawView } from './MarkdownRawView.js'
import { MarkdownRenderedView } from './MarkdownRenderedView.js'

export function MarkdownResponse({ text }: { text: string }) {
  const [raw, setRaw] = useState(false)
  const { Markdown, remarkGfm } = useMarkdownPlugins()
  const toggled = () => setRaw((v) => !v)
  const toggle = <MarkdownToggle raw={raw} onToggle={toggled} />

  const body = raw
    ? <MarkdownRawView text={text} />
    : Markdown
      ? <MarkdownRenderedView text={text} Markdown={Markdown} remarkGfm={remarkGfm} />
      : <p className="text-sm text-muted-foreground">마크다운 렌더링 준비 중...</p>

  return (
    <div className="mt-2">
      {body}
      <div className="mt-2 flex justify-start">{toggle}</div>
    </div>
  )
}
