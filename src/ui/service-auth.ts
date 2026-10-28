import type { Context, Next } from 'hono'
export function serviceAuth(verify: (t?: string) => Promise<void>) {
  return async (c: Context, next: Next) => {
    const h = c.req.header('authorization')
    const t = h?.startsWith('Bearer ') ? h.slice(7) : undefined
    try {
      await verify(t)
    } catch (e) {
      const s = (e as { status?: number }).status === 403 ? 403 : 401
      return c.json({ error: s === 403 ? 'forbidden' : 'unauthorized' }, s)
    }
    await next()
  }
}
