const SAFE_PANE_ID = /^[A-Za-z0-9:_-]{1,128}$/

export function isSafePaneId(value: unknown): value is string {
  return typeof value === 'string' && SAFE_PANE_ID.test(value)
}
