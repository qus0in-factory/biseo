import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
const env = process.env.BISEO_CLAUDE_MODELS
const file = env ? resolve(process.cwd(), env) : fileURLToPath(new URL('../../config/claude-models.json', import.meta.url))
let names: string[] = []
try { names = JSON.parse(readFileSync(file, 'utf8')) } catch { names = [] }
export function claudeModelName(lines: string[]): string | null {
  const blob = lines.join('\n')
  return names.find((n) => blob.includes(n)) ?? null
}
