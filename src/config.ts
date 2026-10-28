import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
type RuntimeConfig = {
  host: string
  port: number
  healthStatus: string
  serviceIssuer: string
  serviceAudience: string
  servicePublicKeyPath: string
}
const file = resolve(process.cwd(), 'config/runtime.json')
const base = JSON.parse(readFileSync(file, 'utf8')) as RuntimeConfig
const e = process.env
export const config: RuntimeConfig = {
  host: e.HOST ?? base.host,
  port: Number(e.PORT ?? base.port),
  healthStatus: e.HEALTH_STATUS ?? base.healthStatus,
  serviceIssuer: e.SERVICE_ISSUER ?? base.serviceIssuer,
  serviceAudience: e.SERVICE_AUDIENCE ?? base.serviceAudience,
  servicePublicKeyPath: e.SERVICE_PUBLIC_KEY_PATH ?? base.servicePublicKeyPath,
}
if (!config.serviceIssuer || !config.serviceAudience || !config.servicePublicKeyPath) {
  throw new Error('service auth misconfigured')
}
