import { readFileSync } from 'node:fs'
import { Hono } from 'hono'
import { serve } from '@hono/node-server'

const file = new URL('../config/runtime.json', import.meta.url)
const config = JSON.parse(readFileSync(file, 'utf8'))
const { HOST, PORT, HEALTH_STATUS } = process.env
const hostname = HOST ?? config.host
const port = Number(PORT ?? config.port)
const status = HEALTH_STATUS ?? config.healthStatus

const app = new Hono()
app.get('/health', (c) => c.json({ status }))

serve({ fetch: app.fetch, hostname, port })
