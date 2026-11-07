import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

export type ClaudeBackoffCfg = { initialMs: number; maxMs: number; factor: number }

export const CLAUDE_BACKOFF_DEFAULT: ClaudeBackoffCfg = { initialMs: 60_000, maxMs: 900_000, factor: 2 }

const pos = (v: unknown, min: number, d: number): number =>
  typeof v === 'number' && Number.isFinite(v) && v >= min ? v : d

export function claudeBackoffCfg(path = resolve(process.cwd(), 'config/claude-oauth.json')): ClaudeBackoffCfg {
  const d = CLAUDE_BACKOFF_DEFAULT
  let j: Partial<Record<keyof ClaudeBackoffCfg, unknown>> = {}
  try {
    const raw: unknown = JSON.parse(readFileSync(path, 'utf8'))
    if (raw && typeof raw === 'object') j = raw
  } catch {
    return d
  }
  const initialMs = pos(j.initialMs, 1, d.initialMs)
  return { initialMs, maxMs: Math.max(initialMs, pos(j.maxMs, 1, d.maxMs)), factor: pos(j.factor, 1, d.factor) }
}
