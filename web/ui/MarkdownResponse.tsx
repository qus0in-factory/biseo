import { useEffect, useState } from 'react'
import type React from 'react'
import { Button } from '../components/ui/button.js'
import { Eye, Code2 } from 'lucide-react'
import { MermaidBlock } from './MermaidBlock.js'
import { safeUrl, fencedLanguage } from '../domain/markdown.js'
import r from '../resources.json'

export function MarkdownResponse({ text }: { text: string }) {
  const [raw, setRaw] = useState(false)
  const [Markdown, setMarkdown] = useState<React.ComponentType<Record<string, unknown>> | null>(null)
  const [remarkGfm, setRemarkGfm] = useState<unknown>(null)

  useEffect(() => {
    let cancelled = false
    Promise.all([import('react-markdown'), import('remark-gfm')]).then(([rm, gfm]) => {
      if (cancelled) return
      setMarkdown(() => (rm as { default: React.ComponentType<Record<string, unknown>> }).default)
      setRemarkGfm(() => (gfm as { default: unknown }).default)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const toggle = (
    <Button
      type="button"
      variant="ghost"
      size="default"
      className="min-h-11 min-w-11 gap-1"
      aria-pressed={!raw}
      onClick={() => setRaw((v) => !v)}
    >
      {raw ? <Eye className="h-4 w-4" aria-hidden="true" /> : <Code2 className="h-4 w-4" aria-hidden="true" />}
      <span>{raw ? '렌더링' : '원본'}</span>
    </Button>
  )

  if (raw) {
    return (
      <div className="mt-2">
        <div className="flex justify-end">{toggle}</div>
        <pre className="mt-2 overflow-x-auto border-l-[3px] border-l-primary bg-surface p-2 font-mono whitespace-pre-wrap break-words">
          {text}
        </pre>
      </div>
    )
  }

  if (!Markdown) {
    return (
      <div className="mt-2">
        <div className="flex justify-end">{toggle}</div>
        <p className="text-sm text-muted-foreground">마크다운 렌더링 준비 중...</p>
      </div>
    )
  }

  return (
    <div className="mt-2">
      <div className="flex justify-end">{toggle}</div>
      <div className="markdown-body break-words">
        <Markdown
          remarkPlugins={remarkGfm ? [remarkGfm] : []}
          skipHtml
          urlTransform={safeUrl}
          components={{
            a: ({ href, children, ...props }: Record<string, unknown>) => (
              <a href={safeUrl(href as string)} target="_blank" rel="noopener noreferrer" {...props}>
                {children as React.ReactNode}
              </a>
            ),
            pre: ({ children }: { children?: React.ReactNode }) => (
              <pre className="my-2 overflow-x-auto max-w-full rounded-md bg-surface p-2">{children}</pre>
            ),
            code: ({ className, children, ...props }: { className?: string; children?: React.ReactNode }) => {
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
            },
            table: ({ children }: { children?: React.ReactNode }) => (
              <div className="my-2 overflow-x-auto">
                <table className="min-w-full border-collapse">{children}</table>
              </div>
            ),
            img: () => null,
          }}
        >
          {text}
        </Markdown>
      </div>
    </div>
  )
}
