export function orderedRemarkPlugins({
  gfm,
  cjkFriendly,
  gfmStrikethrough,
}: {
  gfm: unknown
  cjkFriendly: unknown
  gfmStrikethrough: unknown
}): unknown[] {
  return [gfm, cjkFriendly, gfmStrikethrough]
}

export function isMermaidLanguage(className?: string): boolean {
  return /language-mermaid\b/.test(className ?? '')
}

export function fencedLanguage(className?: string): string | undefined {
  const match = /language-(\w+)/.exec(className ?? '')
  return match?.[1]
}

export { isSafeUrl, safeUrl } from './safeUrl.js'
