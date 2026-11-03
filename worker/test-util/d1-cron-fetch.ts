import { completed } from './d1-completed.js'
export function cronFetch(onTurn: () => void) {
  return async (u: any) => {
    const url = typeof u === 'string' ? u : (u?.url ?? String(u))
    if (url.includes('/herdr/config')) return Response.json({ workspaceId: 'w1T' })
    if (url.includes('/herdr/turns/')) { onTurn(); return Response.json(completed) }
    return Response.json({ providers: [] })
  }
}
