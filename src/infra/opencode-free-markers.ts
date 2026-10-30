const e = process.env

export const getFreeLockStatuses = (): number[] =>
  (e.BISEO_OPENCODE_FREE_LOCK_STATUS ?? '429').split(',')
    .map((s) => Number(s.trim())).filter((n) => Number.isFinite(n))

export const getFreeLockErrors = (): string[] =>
  (e.BISEO_OPENCODE_FREE_LOCK_ERRORS ?? 'FreeUsageLimitError').split(',')
    .map((s) => s.trim()).filter((s) => s !== '')

export function isFreeLockSignal(err?: string | null, st?: number | null): boolean {
  if (typeof st === 'number' && getFreeLockStatuses().includes(st)) return true
  const t = (err ?? '').trim()
  return t !== '' && getFreeLockErrors().includes(t)
}
