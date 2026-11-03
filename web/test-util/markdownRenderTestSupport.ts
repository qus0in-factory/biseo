import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkCjkFriendly from 'remark-cjk-friendly/parseOnly'
import remarkCjkFriendlyGfmStrikethrough from 'remark-cjk-friendly-gfm-strikethrough/parseOnly'
import { orderedRemarkPlugins } from '../domain/markdown.js'
import { MarkdownRenderedView } from '../ui/MarkdownRenderedView.js'

const remarkPlugins = orderedRemarkPlugins({
  gfm: remarkGfm,
  cjkFriendly: remarkCjkFriendly,
  gfmStrikethrough: remarkCjkFriendlyGfmStrikethrough,
})

export function renderMarkdown(text: string): string {
  return renderToStaticMarkup(
    React.createElement(MarkdownRenderedView, {
      text,
      Markdown: Markdown as React.ComponentType<Record<string, unknown>>,
      remarkPlugins,
    }),
  )
}

export function paragraph(html: string): string {
  return `<div class="markdown-body break-words"><p>${html}</p></div>`
}
