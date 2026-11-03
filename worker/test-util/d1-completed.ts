export const completed = {
  requestId: 'r1', workspaceId: 'w1T', paneId: 'w1T:p1', targetName: 'p1', promptText: 'hi',
  status: 'completed', responseText: 'done', errorCode: null,
  createdAt: '2026-10-29T00:00:00Z', completedAt: '2026-10-29T00:01:00Z',
}
export const withFetch = (fn: (u: any) => Response) => {
  const orig = globalThis.fetch
  globalThis.fetch = (async (u: any) => fn(u)) as any
  return () => { globalThis.fetch = orig }
}
