export const allow = { default: ['esc'], opencode: ['esc'], claude: ['esc', 'ctrl+c'] }
export const limited = {
  state: 'limited' as const,
  source: 'codex',
  checkedAt: '2026-10-29T10:00:00.000Z',
  resetsAt: new Date(Date.now() + 60000).toISOString(),
  reason: 'rate_limit_reached',
  window: 'primary' as const,
}
