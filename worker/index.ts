import { Hono } from 'hono'
import { scheduled } from './scheduled.js'
import { registerRoutes } from './ui/routes-registry.js'
import type { SessionBindings } from './ui/types.js'

const app = new Hono<{ Bindings: SessionBindings }>()
registerRoutes(app)

export default {
  fetch: (req: Request, env?: SessionBindings, ctx?: ExecutionContext) =>
    app.fetch(req, env as SessionBindings, ctx as ExecutionContext),
  scheduled,
}
