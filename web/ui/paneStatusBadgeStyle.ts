import type { DisplayStatus as PaneStatus } from '../domain/inputStatus'

type S = { background: string; color: string; border: string }

const accent: Record<PaneStatus, string> = {
  idle: 'var(--status-idle)',
  working: 'var(--status-working)',
  done: 'var(--status-done)',
  blocked: 'var(--status-blocked)',
  input_required: 'var(--color-warning)',
  unknown: 'var(--status-unknown)',
}

const filled = (status: PaneStatus): S => ({
  background: accent[status],
  color: 'var(--color-canvas)',
  border: `1px solid ${accent[status]}`,
})

const styles: Record<PaneStatus, S> = {
  idle: { background: 'transparent', color: accent.idle, border: `1px solid ${accent.idle}` },
  working: filled('working'),
  done: filled('done'),
  blocked: filled('blocked'),
  input_required: filled('input_required'),
  unknown: { background: 'var(--color-surface)', color: 'var(--status-unknown-fg)', border: `1px dashed ${accent.unknown}` },
}

export function statusStyle(status: PaneStatus): S {
  return styles[status]
}

export function statusAccentColor(status: PaneStatus): string {
  return accent[status]
}
