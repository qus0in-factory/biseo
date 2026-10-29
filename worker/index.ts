import { Hono } from 'hono'
import { registerAuthRoutes } from './ui/auth-routes.js'
import { registerHealthRoute } from './ui/health-route.js'
import { registerInterruptRoute } from './ui/interrupt-route.js'
import { registerTimelineRoutes } from './ui/timeline-routes.js'
import { registerStreamRoute } from './ui/timeline-stream.js'
import type { SessionBindings } from './ui/types.js'
import { registerWorkspaceRoutes } from './ui/workspace-routes.js'

const app = new Hono<{ Bindings: SessionBindings }>()

registerAuthRoutes(app)
registerHealthRoute(app)
registerWorkspaceRoutes(app)
registerTimelineRoutes(app)
registerInterruptRoute(app)
registerStreamRoute(app)

export default app
