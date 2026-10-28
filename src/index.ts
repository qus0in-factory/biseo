import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { config } from './config.js'

const app = new Hono()
app.get('/health', (c) => c.json({ status: config.healthStatus }))

serve({ fetch: app.fetch, hostname: config.host, port: config.port })
