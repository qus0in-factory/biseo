import { createAuthedEnv } from './auth-helpers.js'
import { createTestFixture } from './helpers.js'

export async function createTimelineTestEnv() {
  const { env, cookie } = await createAuthedEnv()
  const service = await createTestFixture()
  return {
    cookie,
    env: {
      ...env,
      SERVICE_PASETO_SECRET: service.secretKeyStr,
      FUNNEL_BASE_URL: 'https://funnel.example.com',
      ALLOWED_WORKSPACE_ID: 'w1T',
      ALLOWED_ORIGINS: 'http://localhost',
      UPSTREAM_TIMEOUT_MS: '1000',
    },
  }
}
