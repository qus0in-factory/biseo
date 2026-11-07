import { readFileSync } from 'node:fs'
import { configPath } from './config-path.js'
const file = configPath(process.env.BISEO_CLAUDE_MODELS, new URL('../../config/claude-models.json', import.meta.url))
let names: string[] = []
try { names = JSON.parse(readFileSync(file, 'utf8')) } catch { names = [] }
export function claudeModelName(lines: string[]): string | null {
  const blob = lines.join('\n')
  return names.find((n) => blob.includes(n)) ?? null
}
