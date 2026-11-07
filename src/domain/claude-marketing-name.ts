export function claudeMarketingName(text: string): string | null {
  for (const line of text.split('\n')) {
    if (!line.includes('marketingName')) continue
    try {
      const attachment = JSON.parse(line)?.attachment
      const name = attachment?.type === 'model' ? attachment.identity?.marketingName : undefined
      if (typeof name === 'string' && name.trim()) return name.trim()
    } catch { /* not a model record */ }
  }
  return null
}
