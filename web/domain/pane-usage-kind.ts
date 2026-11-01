const KNOWN_KINDS: Record<string, string> = {
  claude: 'claude',
  codex: 'codex',
  agy: 'agy',
  antigravity: 'agy',
  gemini: 'agy',
  grok: 'grok',
  ollama: 'ollama',
}

const OBSERVED: Record<string, string> = {
  claude: 'claude',
  anthropic: 'claude',
  codex: 'codex',
  openai: 'codex',
  agy: 'agy',
  grok: 'grok',
  ollama: 'ollama',
  'ollama-cloud': 'ollama',
  'opencode-go': 'opencode-go',
}

export function matchProviderKey(
  kind?: string | null,
  provider?: string | null,
): string | null {
  const observed = (provider ?? '').trim().toLowerCase()
  if (observed) return OBSERVED[observed] ?? null
  const k = (kind ?? '').trim().toLowerCase()
  return KNOWN_KINDS[k] ?? null
}
