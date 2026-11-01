import type { App } from './timeline-guards.js'
import { handlePinLogin } from './pin-login-route.js'
import { putPin } from './pin-put-route.js'
import { deletePin } from './pin-delete-route.js'
import { registerTrustedIpRoutes } from './trusted-ip-routes.js'

export function registerPinRoutes(app: App) {
  app.post('/api/login/pin', handlePinLogin)
  app.put('/api/pin', putPin)
  app.delete('/api/pin', deletePin)
  registerTrustedIpRoutes(app)
}
