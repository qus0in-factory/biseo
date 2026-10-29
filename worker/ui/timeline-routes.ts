import { registerDeleteTurn } from './delete-turn-route.js'
import { registerTimelineMessages } from './timeline-message-routes.js'
import type { App } from './timeline-guards.js'

export function registerTimelineRoutes(app: App) {
  registerTimelineMessages(app)
  registerDeleteTurn(app)
}
