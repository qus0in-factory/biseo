export function recoveryFetch(onTurn: () => void) {
  return async (u: any) => {
    const url = typeof u === 'string' ? u : (u?.url ?? String(u))
    if (url.includes('/herdr/config')) return Response.json({ workspaceId: 'w1T' })
    if (url.includes('/herdr/turns/')) { onTurn(); return Response.json({ error: 'not_found' }, { status: 404 }) }
    return Response.json({ providers: [] })
  }
}
