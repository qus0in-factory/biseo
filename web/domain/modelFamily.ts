export type ModelFamily = 'claude' | 'gpt' | 'gemini' | 'deepseek' | 'other'

export function modelFamily(id?: string | null, provider?: string | null): ModelFamily {
  const text = `${id ?? ''} ${provider ?? ''}`.toLowerCase()
  if (text.includes('claude') || text.includes('anthropic')) return 'claude'
  if (text.includes('gemini') || text.includes('google')) return 'gemini'
  if (text.includes('deepseek')) return 'deepseek'
  if (text.includes('gpt') || text.includes('openai') || text.includes('codex')) return 'gpt'
  return 'other'
}
