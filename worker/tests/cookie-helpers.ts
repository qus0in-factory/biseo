import app from '../index.js'

export function parseCookieAttrs(header: string) {
  const parts = header.split(';').map((s) => s.trim())
  const [name, val] = parts[0].split('=')
  const attrs = new Map<string, string | true>()
  for (const part of parts.slice(1)) {
    const [k, v] = part.split('=')
    attrs.set(k.toLowerCase(), v !== undefined ? v : true)
  }
  return { name, value: val ?? '', attrs }
}

export function postJson(path: string, body?: any, env?: any) {
  return app.fetch(
    new Request(`http://localhost${path}`, {
      method: 'POST',
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    }),
    env,
  )
}
