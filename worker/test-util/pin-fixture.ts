import { createFakeD1 } from './fake-d1.js'
import { createTestFixture } from './helpers.js'
import { createMockKv } from './kv-helpers.js'

export async function pinEnv(extra: Record<string, unknown> = {}) {
  const { password, stored, secretKeyStr } = await createTestFixture()
  const db = createFakeD1()
  const env = {
    AUTH_PASSWORD_VERIFIER: stored,
    USER_SESSION_PASETO_SECRET: secretKeyStr,
    LOGIN_ATTEMPTS: createMockKv(),
    BISEO_DB: db,
    PIN_ALLOWED_HOSTS: 'biseo.qus0in.dev',
    PIN_MAX_ATTEMPTS: '5',
    PIN_GLOBAL_MAX_ATTEMPTS: '20',
    PIN_ATTEMPT_WINDOW_SECONDS: '900',
    PIN_LOCK_SECONDS: '900',
    ...extra,
  }
  return { env, db, password }
}
