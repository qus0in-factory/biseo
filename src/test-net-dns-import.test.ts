import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import '../scripts/test-net-guard.mjs';

for (const [name, code] of [
  ['lookup', "import { lookup } from 'node:dns'; try { lookup('example.invalid', () => {}) } catch {}"],
  ['resolve4', "import { resolve4 } from 'node:dns/promises'; try { await resolve4('example.invalid') } catch {}"],
]) test(`named dns ${name}`, () => {
  const r = spawnSync(process.execPath, ['--import=./scripts/test-net-guard.mjs', '--input-type=module', '-e', code], { encoding: 'utf8', timeout: 5000 });
  assert.equal(r.status, 1);
  assert.equal(r.stderr.trim(), 'test-net-guard: example.invalid');
});

test('dns resolve* wrapped', async () => {
  const dns = (await import('node:dns')).default;
  for (const o of [dns, dns.promises, dns.Resolver.prototype, dns.promises.Resolver.prototype])
    for (const n of Object.getOwnPropertyNames(o))
      if (n.startsWith('resolve')) assert.ok(o[n].__guarded, n);
});
