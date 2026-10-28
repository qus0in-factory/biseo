import { Hono } from 'hono'
import ky, { TimeoutError } from 'ky'

type Bindings = {
  FUNNEL_HEALTH_URL?: string
  HEALTH_TIMEOUT_MS?: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/api/health', async (c) => {
  const url = c.env.FUNNEL_HEALTH_URL
  if (!url) return c.json({ error: 'misconfigured' }, 502)
  const timeout = Number(c.env.HEALTH_TIMEOUT_MS)
  if (!Number.isFinite(timeout) || timeout <= 0)
    return c.json({ error: 'misconfigured' }, 502)
  try {
    const res = await ky.get(url, { retry: 0, timeout }).json()
    return c.json(res)
  } catch (err) {
    const isTimeout = err instanceof TimeoutError
    const status = isTimeout ? 504 : 502
    return c.json({ error: isTimeout ? 'timeout' : 'bad_gateway' }, status)
  }
})

export default app
