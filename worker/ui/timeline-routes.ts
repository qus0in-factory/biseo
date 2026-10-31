import { registerDeleteTurn } from './delete-turn-route.js'
import { registerTimelineMessages } from './timeline-message-routes.js'
import type { App } from './timeline-guards.js'
import { registerQueueCompleted } from './queue-completed-route.js'
import { registerRetryReservation } from './retry-reservation-route.js'

export function registerTimelineRoutes(app: App) {
  registerQueueCompleted(app)
  registerRetryReservation(app)
  registerTimelineMessages(app)
  registerDeleteTurn(app)
}
