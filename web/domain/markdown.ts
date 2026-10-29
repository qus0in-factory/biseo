export function isMermaidLanguage(className?: string): boolean {
  return /language-mermaid\b/.test(className ?? '')
}

export function fencedLanguage(className?: string): string | undefined {
  const match = /language-(\w+)/.exec(className ?? '')
  return match?.[1]
}

export function isSafeUrl(url?: string): boolean {
  if (!url) return false
  if (url.startsWith('/') || url.startsWith('#') || url.startsWith('.') || url.startsWith('data:')) {
    return !url.toLowerCase().includes('javascript:')
  }
  try {
    const parsed = new URL(url)
    return ['http:', 'https:', 'mailto:', 'tel:'].includes(parsed.protocol)
  } catch {
    return false
  }
}

export function safeUrl(url?: string): string | undefined {
  return isSafeUrl(url) ? url : undefined
}
