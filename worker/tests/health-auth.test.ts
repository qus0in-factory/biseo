import assert from 'node:assert/strict';
import test from 'node:test';
import app from '../index.js';
import { createAuthedEnv } from '../test-util/auth-helpers.js';

test('health authenticates before calling upstream', async (t) => {
  const { env } = await createAuthedEnv();
  const upstream = t.mock.method(globalThis, 'fetch', async () => Response.json({}));
  const res = await app.fetch(new Request('http://localhost/api/health'), env);
  assert.equal(res.status, 401);
  assert.deepEqual(await res.json(), { error: 'unauthorized' });
  assert.equal(upstream.mock.callCount(), 0);
});
