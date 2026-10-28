import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

type RuntimeConfig = {
  host: string
  port: number
  healthStatus: string
}

const file = resolve(process.cwd(), 'config/runtime.json')
const base = JSON.parse(readFileSync(file, 'utf8')) as RuntimeConfig
const { HOST, PORT, HEALTH_STATUS } = process.env

export const config: RuntimeConfig = {
  host: HOST ?? base.host,
  port: Number(PORT ?? base.port),
  healthStatus: HEALTH_STATUS ?? base.healthStatus,
}
