export type SubmitMessageInput = {
  requestId: string
  workspaceId: string
  paneId: string
  text: string
}

const SAFE_ID_RE = /^[A-Za-z0-9:_-]{1,128}$/

export function isSafeId(value: unknown): value is string {
  return typeof value === 'string' && SAFE_ID_RE.test(value)
}

export function parseSubmitMessageInput(body: unknown): SubmitMessageInput | null {
  if (!body || typeof body !== 'object') return null
  const b = body as Record<string, unknown>
  if (typeof b.text !== 'string') return null
  const requestId = typeof b.requestId === 'string' ? b.requestId.trim() : ''
  const workspaceId = typeof b.workspaceId === 'string' ? b.workspaceId.trim() : ''
  const paneId = typeof b.paneId === 'string' ? b.paneId.trim() : ''
  const text = b.text.trim()
  if (!isSafeId(requestId) || !isSafeId(workspaceId) || !isSafeId(paneId)) return null
  if (!text || text.length > 16384) return null
  return { requestId, workspaceId, paneId, text }
}
