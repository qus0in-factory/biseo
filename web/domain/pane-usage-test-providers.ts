import type { UsageProvider } from './usage'

export const testProviders: UsageProvider[] = [
  { provider: 'claude', state: 'available', windows: [] },
  { provider: 'codex', state: 'available', windows: [] },
  { provider: 'agy', state: 'available', windows: [] },
  { provider: 'grok', state: 'available', windows: [] },
  { provider: 'ollama', state: 'available', windows: [] },
  { provider: 'opencode-go', state: 'available', windows: [] },
]
