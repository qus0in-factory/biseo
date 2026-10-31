export function matchProviderKey(
  kind?: string | null,
  name?: string | null,
): string | null {
  const k = (kind ?? '').trim().toLowerCase()
  const n = (name ?? '').trim().toLowerCase()
  if (k === 'claude' || n.includes('claude') || n.includes('opus')) return 'claude'
  if (k === 'codex' || n.includes('codex') || n.includes('gpt')) return 'codex'
  if (k === 'agy' || k === 'antigravity' || k === 'gemini' || n.includes('gemini')) return 'agy'
  if (k === 'grok' || n.includes('grok')) return 'grok'
  if (k === 'ollama' || n.includes('ollama')) return 'ollama'
  if (k === 'opencode-go' || n.includes('opencode-go') || n.includes('go')) return 'opencode-go'
  return null
}
