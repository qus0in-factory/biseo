const KNOWN_KINDS: Record<string, string> = {
  claude: 'claude',
  codex: 'codex',
  agy: 'agy',
  antigravity: 'agy',
  gemini: 'agy',
  grok: 'grok',
  ollama: 'ollama',
}

export function matchProviderKey(kind?: string | null): string | null {
  const k = (kind ?? '').trim().toLowerCase()
  return KNOWN_KINDS[k] ?? null
}
