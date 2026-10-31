export function matchProviderKey(kind: string): string {
  const k = kind.trim().toLowerCase()
  if (k === 'agy' || k === 'antigravity' || k === 'gemini') return 'agy'
  if (k === 'opencode' || k === 'opencode-go') return 'opencode-go'
  return k
}
