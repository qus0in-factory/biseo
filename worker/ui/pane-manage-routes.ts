import { checkCsrf, type App } from './timeline-guards.js'
import type { MiddlewareHandler } from 'hono'
import type { SessionBindings } from './types.js'
import { registerPaneOpenRoute } from './panes-open-route.js'
import { registerPaneCloseRoute } from './panes-close-route.js'
import { registerPaneRenameRoute } from './panes-rename-route.js'
export function registerPaneManageRoutes(app: App) {
  const csrf: MiddlewareHandler<{ Bindings: SessionBindings }> = async (c, next) => {
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(c.req.method)) {
      const denied = checkCsrf(c)
      if (denied) return denied
    }
    await next()
  }
  app.use('/api/panes', csrf)
  app.use('/api/panes/*', csrf)
  registerPaneOpenRoute(app)
  registerPaneCloseRoute(app)
  registerPaneRenameRoute(app)
}
