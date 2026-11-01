import type { App } from './timeline-guards.js'
import { trustedIpStatus } from './trusted-ip-read.js'
import { addTrustedIp, removeTrustedIp } from './trusted-ip-write.js'

export function registerTrustedIpRoutes(app: App) {
  app.get('/api/trusted-ip', trustedIpStatus)
  app.post('/api/trusted-ip', addTrustedIp)
  app.delete('/api/trusted-ip', removeTrustedIp)
}
