const CONTROL_OR_SPACE = /[\s\u0000-\u001f\u007f-\u009f\u200b-\u200f\u202a-\u202e\u2060\ufeff]/g

export function isSafeUrl(url?: string): boolean {
  if (!url) return false
  const normalized = url.replace(CONTROL_OR_SPACE, '')
  if (!normalized) return false
  const lower = normalized.toLowerCase()
  if (lower.startsWith('javascript:') || lower.startsWith('vbscript:') || lower.startsWith('data:')) {
    return false
  }
  if (normalized.startsWith('/') || normalized.startsWith('#') || normalized.startsWith('.')) {
    return !lower.includes('javascript:') && !lower.includes('vbscript:') && !lower.includes('data:')
  }
  try {
    const parsed = new URL(normalized)
    return ['http:', 'https:', 'mailto:', 'tel:'].includes(parsed.protocol)
  } catch {
    return false
  }
}

export function safeUrl(url?: string): string | undefined {
  return isSafeUrl(url) ? url : undefined
}
