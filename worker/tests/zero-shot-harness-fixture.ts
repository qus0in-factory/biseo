import { createAuthedEnv } from './auth-helpers.js'
import { createTestFixture } from './helpers.js'
import { createZeroShotBackend } from './zero-shot-backend-fixture.js'
import { startZeroShotSocket } from './zero-shot-socket-fixture.js'

export async function createZeroShotHarness() {
  const { env, cookie } = await createAuthedEnv()
  const svc = await createTestFixture()
  const { backend, getPromptCalls } = await createZeroShotBackend(svc.publicKeyStr)
  const close = await startZeroShotSocket()
  const orig = globalThis.fetch
  let gets = 0
  globalThis.fetch = (async (u: any, init?: RequestInit) => {
    const r = new Request(u, init)
    if (r.url.includes('/herdr/turns/')) gets++
    return backend.fetch(r)
  }) as typeof fetch
  return {
    cookie,
    env: { ...env, SERVICE_PASETO_SECRET: svc.secretKeyStr, FUNNEL_BASE_URL: 'https://f.test', ALLOWED_WORKSPACE_ID: 'w1T' },
    getPromptCalls, getTurnGets: () => gets,
    cleanup: async () => { globalThis.fetch = orig; await close() },
  }
}
