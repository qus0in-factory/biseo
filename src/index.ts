import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { config } from './config.js'
import { createVerifyService } from './app/verify-service.js'
import { serviceAuth } from './ui/service-auth.js'
import { loadServiceVerifier } from './infra/service-verifier.js'
const verifier = await loadServiceVerifier(config.servicePublicKeyPath)
const verify = createVerifyService(verifier, { issuer: config.serviceIssuer, audience: config.serviceAudience })
const app = new Hono()
app.use('/health', serviceAuth(verify))
app.get('/health', (c) => c.json({ status: config.healthStatus }))
serve({ fetch: app.fetch, hostname: config.host, port: config.port })
