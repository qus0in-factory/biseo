import type { MiddlewareHandler } from 'hono'
import { applySecurityHeaders } from '../../shared/domain/security-headers.js'

export const securityHeaders: MiddlewareHandler = async (c, next) => {
  await next()
  applySecurityHeaders(c.res.headers)
}
