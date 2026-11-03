import app from '../index.js'

export const post = (paneId: string, key: string, headers: Record<string, string>) =>
  new Request(`http://localhost/api/panes/${paneId}/interrupt`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...headers },
    body: JSON.stringify({ key }),
  })

export const interrupt = (env: any, paneId: string, key: string, headers: Record<string, string>) =>
  app.fetch(post(paneId, key, headers), env)

export const limitBody = {
  error: 'target_not_ready',
  reason: 'usage_limited',
  resetsAt: '2026-10-29T11:00:00.000Z',
}
export const expectedPrompt = { key: 'escape' }
export const authHeaders = (cookie: string) => ({ Cookie: cookie, Origin: 'http://localhost' })
