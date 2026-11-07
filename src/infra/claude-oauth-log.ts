import { logger } from './logger.js'

type Row = { status: number; retryAfter: string | null }
type Write = (row: Row) => void

const quiet: Write = (row) => { logger.info(row, 'claude.usage.429') }
let write: Write = quiet

export function setClaude429Log(fn: Write | null): void {
  write = fn ?? quiet
}

export function logClaude429(status: number, retryAfter: string | null): void {
  write({ status, retryAfter })
}
