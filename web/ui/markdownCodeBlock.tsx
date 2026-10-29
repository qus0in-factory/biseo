import type React from 'react'
import { MermaidBlock } from './MermaidBlock.js'
import { fencedLanguage } from '../domain/markdown.js'

export function MarkdownCode({
  className,
  children,
  ...props
}: {
  className?: string
  children?: React.ReactNode
}) {
  const lang = fencedLanguage(className)
  const value = String(children).replace(/\n$/, '')
  if (lang === 'mermaid') return <MermaidBlock source={value} />
  if (!className) {
    return (
      <code className="rounded bg-surface px-1 py-0.5 font-mono text-sm" {...props}>
        {children}
      </code>
    )
  }
  return (
    <code className={className} {...props}>
      {children}
    </code>
  )
}
