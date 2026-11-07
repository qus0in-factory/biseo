import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

test('external reverse exits before reaching the DNS implementation', () => {
  const code = `
    import dns from 'node:dns';
    dns.reverse = () => { console.error('DNS reached'); process.exit(42); };
    await import('./scripts/test-net-guard.mjs');
    try { dns.reverse('8.8.8.8', () => {}); } catch {}
  `;
  const result = spawnSync(process.execPath, ['--input-type=module', '-e', code], {
    encoding: 'utf8', timeout: 5000,
    env: { ...process.env, NODE_OPTIONS: '' },
  });
  assert.equal(result.error, undefined);
  assert.equal(result.signal, null);
  assert.equal(result.status, 1);
  assert.equal(result.stdout, '');
  assert.equal(result.stderr.trim(), 'test-net-guard: 8.8.8.8');
});
