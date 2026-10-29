import { useEffect, useState } from 'react'
import type React from 'react'

export function useMarkdownPlugins() {
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

  return { Markdown, remarkGfm }
}
