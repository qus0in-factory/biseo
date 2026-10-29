export const at = '2026-10-29T11:00:00.000Z'
export const limited = {
  state: 'limited' as const,
  source: 'codex',
  checkedAt: '2026-10-29T10:00:00.000Z',
  resetsAt: at,
  reason: 'rate_limit_reached',
  window: 'primary' as const,
}
export const screen = (ok: boolean) => ({ classify: async () => ok })
