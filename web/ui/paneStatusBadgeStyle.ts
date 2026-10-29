const K = ['idle', 'working', 'done', 'blocked', 'unknown']
const B = ['transparent', 'status-working', 'status-done', 'status-blocked', 'color-surface']
const T = ['status-idle', 'color-canvas', 'color-canvas', 'color-canvas', 'color-primary']
const E = ['status-idle', 'status-working', 'status-done', 'status-blocked', 'status-unknown']

export function statusStyle(s: string): Record<string, string> {
  const i = K.indexOf(s)
  const bg = B[i] === 'transparent' ? 'transparent' : `var(--${B[i]})`
  return { background: bg, color: `var(--${T[i]})`, border: `1px ${i === 4 ? 'dashed' : 'solid'} var(--${E[i]})` }
}
