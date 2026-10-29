import type React from 'react'
import { safeUrl } from '../domain/markdown.js'
import { markdownComponents } from './markdownComponents.js'

export function MarkdownRenderedView({
  text,
  toggle,
  Markdown,
  remarkGfm,
}: {
  text: string
  toggle: React.ReactNode
  Markdown: React.ComponentType<Record<string, unknown>>
  remarkGfm: unknown
}) {
  return (
    <div className="mt-2">
      <div className="flex justify-end">{toggle}</div>
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
    </div>
  )
}
