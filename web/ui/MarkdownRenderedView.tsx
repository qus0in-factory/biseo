import type React from 'react'
import { safeUrl } from '../domain/markdown.js'
import { markdownComponents } from './markdownComponents.js'

export function MarkdownRenderedView({
  text,
  Markdown,
  remarkPlugins,
}: {
  text: string
  Markdown: React.ComponentType<Record<string, unknown>>
  remarkPlugins: unknown[]
}) {
  return (
    <div className="markdown-body break-words">
      <Markdown
        remarkPlugins={remarkPlugins}
        skipHtml
        urlTransform={safeUrl}
        components={markdownComponents}
      >
        {text}
      </Markdown>
    </div>
  )
}
