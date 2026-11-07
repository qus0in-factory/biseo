import assert from 'node:assert/strict';
import test from 'node:test';
import app from '../index.js';
import { createAuthedEnv } from '../test-util/auth-helpers.js';

test('does not call upstream when the service secret is missing', async (t) => {
  const { env, cookie } = await createAuthedEnv();
  const upstream = t.mock.method(globalThis, 'fetch', async () => Response.json({}));
  const req = new Request('http://localhost/api/health', { headers: { Cookie: cookie } });
  const res = await app.fetch(req, {
    ...env,
    FUNNEL_HEALTH_URL: 'https://backend.test/health',
    HEALTH_TIMEOUT_MS: '1000',
  });
  assert.equal(res.status, 502);
  assert.deepEqual(await res.json(), { error: 'misconfigured' });
  assert.equal(upstream.mock.callCount(), 0);
});
