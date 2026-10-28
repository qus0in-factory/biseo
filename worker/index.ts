import { Hono } from 'hono'
import { registerAuthRoutes } from './ui/auth-routes.js'
import { registerHealthRoute } from './ui/health-route.js'
import type { SessionBindings } from './ui/types.js'

const app = new Hono<{ Bindings: SessionBindings }>()

registerAuthRoutes(app)
registerHealthRoute(app)

export default app
