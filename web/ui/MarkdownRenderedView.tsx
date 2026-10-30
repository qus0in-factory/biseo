import type React from 'react'
import { safeUrl } from '../domain/markdown.js'
import { markdownComponents } from './markdownComponents.js'

export function MarkdownRenderedView({
  text,
  Markdown,
  remarkGfm,
}: {
  text: string
  Markdown: React.ComponentType<Record<string, unknown>>
  remarkGfm: unknown
}) {
  return (
    <div className="markdown-body break-words">
      <Markdown
        remarkPlugins={remarkGfm ? [remarkGfm] : []}
        skipHtml
        urlTransform={safeUrl}
        components={markdownComponents}
      >
        {text}
      </Markdown>
    </div>
  )
}
