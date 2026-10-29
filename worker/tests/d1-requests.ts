export const post = (body: unknown, cookie: string) =>
  new Request('http://localhost/api/timeline/messages', {
    method: 'POST',
    headers: { Cookie: cookie, Origin: 'http://localhost', 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

export const getList = (cookie: string) =>
  new Request('http://localhost/api/timeline/messages?workspaceId=w1T', { headers: { Cookie: cookie } })

export const getOne = (id: string, cookie: string) =>
  new Request(`http://localhost/api/timeline/messages/${id}`, { headers: { Cookie: cookie } })
