import app from '../index.js'
import { ZERO_SHOT_BODY } from './zero-shot-data-fixture.js'

const POST = 'http://localhost/api/timeline/messages'
const SSE = 'http://localhost/api/timeline/stream?workspaceId=w1T'

export const postZeroShot = (env: any, cookie?: string) =>
  app.fetch(
    new Request(POST, {
      method: 'POST',
      headers: { Origin: 'http://localhost', ...(cookie ? { Cookie: cookie } : {}) },
      body: ZERO_SHOT_BODY,
    }),
    env,
  )

export const openZeroShotSse = (env: any, cookie?: string) =>
  app.fetch(new Request(SSE, { headers: cookie ? { Cookie: cookie } : {} }), env)
