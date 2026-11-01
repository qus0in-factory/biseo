import { type App } from './timeline-guards.js'
import { registerPaneOpenRoute } from './panes-open-route.js'
import { registerPaneCloseRoute } from './panes-close-route.js'
import { registerPaneRenameRoute } from './panes-rename-route.js'
export function registerPaneManageRoutes(app: App) {
  registerPaneOpenRoute(app)
  registerPaneCloseRoute(app)
  registerPaneRenameRoute(app)
}
