import type { App } from './timeline-guards.js'
import { registerWorkspaceSource } from './workspace-source.js'
import { registerAuthRoutes } from './auth-routes.js'
import { registerPinRoutes } from './pin-routes.js'
import { registerHealthRoute } from './health-route.js'
import { registerInterruptRoute } from './interrupt-route.js'
import { registerTimelineRoutes } from './timeline-routes.js'
import { registerStreamRoute } from './timeline-stream.js'
import { registerUsageRoute } from './usage-route.js'
import { registerWorkspaceRoutes } from './workspace-routes.js'

export function registerRoutes(app: App) {
  registerWorkspaceSource(app)
  registerAuthRoutes(app)
  registerPinRoutes(app)
  registerHealthRoute(app)
  registerWorkspaceRoutes(app)
  registerTimelineRoutes(app)
  registerInterruptRoute(app)
  registerStreamRoute(app)
  registerUsageRoute(app)
}
