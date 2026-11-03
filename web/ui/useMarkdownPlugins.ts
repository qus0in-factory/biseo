import { useEffect, useState } from 'react'
import type React from 'react'
import { orderedRemarkPlugins } from '../domain/markdown.js'

type MarkdownModules = {
  Markdown: React.ComponentType<Record<string, unknown>>
  remarkPlugins: unknown[]
}

export function useMarkdownPlugins() {
  const [modules, setModules] = useState<MarkdownModules | null>(null)

  useEffect(() => {
    let cancelled = false
    Promise.all([
      import('react-markdown'),
      import('remark-gfm'),
      import('remark-cjk-friendly/parseOnly'),
      import('remark-cjk-friendly-gfm-strikethrough/parseOnly'),
    ]).then(([rm, gfm, cjkFriendly, gfmStrikethrough]) => {
      if (cancelled) return
      setModules({
        Markdown: (rm as { default: React.ComponentType<Record<string, unknown>> }).default,
        remarkPlugins: orderedRemarkPlugins({
          gfm: (gfm as { default: unknown }).default,
          cjkFriendly: (cjkFriendly as { default: unknown }).default,
          gfmStrikethrough: (gfmStrikethrough as { default: unknown }).default,
        }),
      })
    })
    return () => {
      cancelled = true
    }
  }, [])

  return modules ?? { Markdown: null, remarkPlugins: [] }
}
