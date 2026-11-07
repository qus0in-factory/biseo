import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

export type ClaudeBackoffCfg = { initialMs: number; maxMs: number; factor: number }

export function claudeBackoffCfg(path = resolve(process.cwd(), 'config/claude-oauth.json')): ClaudeBackoffCfg {
  const j = JSON.parse(readFileSync(path, 'utf8')) as ClaudeBackoffCfg
  return { initialMs: j.initialMs, maxMs: j.maxMs, factor: j.factor }
}
