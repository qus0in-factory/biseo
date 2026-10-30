import { Hono } from 'hono'
import { scheduled } from './scheduled.js'
import {registerWorkspaceSource} from './ui/workspace-source.js'
import { registerAuthRoutes } from './ui/auth-routes.js'
import { registerHealthRoute } from './ui/health-route.js'
import { registerInterruptRoute } from './ui/interrupt-route.js'
import { registerTimelineRoutes } from './ui/timeline-routes.js'
import { registerStreamRoute } from './ui/timeline-stream.js'
import type { SessionBindings } from './ui/types.js'
import { registerUsageRoute } from './ui/usage-route.js'
import { registerWorkspaceRoutes } from './ui/workspace-routes.js'

const app = new Hono<{ Bindings: SessionBindings }>()

registerWorkspaceSource(app)
registerAuthRoutes(app)
registerHealthRoute(app)
registerWorkspaceRoutes(app)
registerTimelineRoutes(app)
registerInterruptRoute(app)
registerStreamRoute(app)
registerUsageRoute(app)

export default {
  fetch: (req: Request, env?: SessionBindings, ctx?: ExecutionContext) =>
    app.fetch(req, env as SessionBindings, ctx as ExecutionContext),
  scheduled,
}
