import assert from 'node:assert/strict';
import test from 'node:test';
import app from '../index.js';
import { createAuthedEnv } from '../test-util/auth-helpers.js';
import { createTestFixture } from '../test-util/helpers.js';

test('health network failure is 502', async (t) => {
  const { env, cookie } = await createAuthedEnv();
  const { secretKeyStr } = await createTestFixture();
  const upstream = t.mock.method(globalThis, 'fetch', async () => {
    throw new Error('mock upstream unavailable');
  });
  const res = await app.fetch(new Request('http://localhost/api/health', {
    headers: { Cookie: cookie },
  }), {
    ...env,
    SERVICE_PASETO_SECRET: secretKeyStr,
    FUNNEL_HEALTH_URL: 'http://upstream.invalid/health',
    HEALTH_TIMEOUT_MS: '1000',
  });
  assert.equal(res.status, 502);
  assert.deepEqual(await res.json(), { error: 'bad_gateway' });
  assert.equal(upstream.mock.callCount(), 1);
});
