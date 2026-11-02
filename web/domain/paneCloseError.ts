import r from '../resources.json'

export class PaneCloseError extends Error {
  constructor(readonly code: string | null) {
    super(code ?? 'pane_close_failed')
    this.name = 'PaneCloseError'
  }
}

const messages: Record<string, string> = {
  pane_busy: r.paneCloseBusy,
  pane_inflight: r.paneCloseInFlight,
  pending_reservations: r.paneClosePending,
  pane_not_found: r.paneCloseNotFound,
  workspace_not_allowed: r.paneCloseForbidden,
}

export function paneCloseMessage(error: unknown): string {
  const code = error instanceof PaneCloseError ? error.code : null
  return (code && messages[code]) || r.connection_unavailable
}
