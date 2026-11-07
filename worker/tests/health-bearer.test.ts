import assert from 'node:assert/strict';
import test from 'node:test';
import app from '../index.js';
import { createAuthedEnv } from '../test-util/auth-helpers.js';
import { createTestFixture } from '../test-util/helpers.js';

test('attaches a service bearer token upstream', async (t) => {
  const { env, cookie } = await createAuthedEnv();
  const { secretKeyStr } = await createTestFixture();
  let auth = '';
  t.mock.method(globalThis, 'fetch', async (input: RequestInfo | URL) => {
    auth = new Request(input).headers.get('authorization') ?? '';
    return Response.json({ status: 'ok' });
  });
  const req = new Request('http://localhost/api/health', { headers: { Cookie: cookie } });
  const res = await app.fetch(req, {
    ...env,
    FUNNEL_HEALTH_URL: 'https://backend.test/health',
    HEALTH_TIMEOUT_MS: '1000',
    SERVICE_PASETO_SECRET: secretKeyStr,
  });
  assert.equal(res.status, 200);
  assert.match(auth, /^Bearer v4\.public\./);
});
