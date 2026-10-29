import type React from 'react'
import { safeUrl } from '../domain/markdown.js'
import { MarkdownCode } from './markdownCodeBlock.js'

export const markdownComponents = {
  a: ({ href, children, ...props }: Record<string, unknown>) => (
    <a href={safeUrl(href as string)} target="_blank" rel="noopener noreferrer" {...props}>
      {children as React.ReactNode}
    </a>
  ),
  pre: ({ children }: { children?: React.ReactNode }) => (
    <pre className="my-2 overflow-x-auto max-w-full rounded-md bg-surface p-2">{children}</pre>
  ),
  code: MarkdownCode,
  table: ({ children }: { children?: React.ReactNode }) => (
    <div className="my-2 overflow-x-auto">
      <table className="min-w-full border-collapse">{children}</table>
    </div>
  ),
  img: () => null,
}
