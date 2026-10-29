import type { PaneStatus } from '../domain/timeline'

type S = { background: string; color: string; border: string }

const styles: Record<PaneStatus, S> = {
  idle: { background: 'transparent', color: 'var(--status-idle)', border: '1px solid var(--status-idle)' },
  working: { background: 'var(--status-working)', color: 'var(--color-canvas)', border: '1px solid var(--status-working)' },
  done: { background: 'var(--status-done)', color: 'var(--color-canvas)', border: '1px solid var(--status-done)' },
  blocked: { background: 'var(--status-blocked)', color: 'var(--color-canvas)', border: '1px solid var(--status-blocked)' },
  unknown: { background: 'var(--color-surface)', color: 'var(--color-primary)', border: '1px dashed var(--status-unknown)' },
}

export function statusStyle(status: PaneStatus): S {
  return styles[status]
}
