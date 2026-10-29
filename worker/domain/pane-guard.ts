import { isSafeId } from './message-input.js'

export function paneInWorkspace(allowed: string, paneId: string): boolean {
  if (!isSafeId(paneId)) return false
  const at = paneId.indexOf(':')
  return at > 0 && at < paneId.length - 1 && paneId.slice(0, at) === allowed
}
