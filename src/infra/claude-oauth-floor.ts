import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { DATE_LIMIT_MS } from './claude-date-range.js'

const FALLBACK = 600_000

const ok = (v: unknown): number | null =>
  typeof v === 'number' && Number.isFinite(v) && v >= 1 && v <= DATE_LIMIT_MS ? v : null

export function claudeFloorMs(
  path = resolve(process.cwd(), 'config/claude-oauth.json'),
  env = process.env.BISEO_CLAUDE_FLOOR_MS,
): number {
  const fromEnv = ok(env === undefined ? null : Number(env))
  if (fromEnv) return fromEnv
  try {
    return ok(JSON.parse(readFileSync(path, 'utf8'))?.floorMs) ?? FALLBACK
  } catch {
    return FALLBACK
  }
}
