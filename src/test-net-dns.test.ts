import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

function run(code) {
  const result = spawnSync(process.execPath, [
    '--import=./scripts/test-net-guard.mjs', '--input-type=module', '-e', code,
  ], { encoding: 'utf8', timeout: 5000 });
  assert.equal(result.status, 1);
  assert.equal(result.stderr.trim(), 'test-net-guard: example.invalid');
}

for (const [name, code] of [
  ['lookup', "const dns = await import('node:dns'); try { dns.lookup('example.invalid', () => {}) } catch {}"],
  ['resolve4', "const dns = await import('node:dns'); try { dns.resolve4('example.invalid', () => {}) } catch {}"],
  ['promises lookup', "const dns = await import('node:dns'); try { await dns.promises.lookup('example.invalid') } catch {}"],
  ['promises resolve4', "const dns = await import('node:dns'); try { await dns.promises.resolve4('example.invalid') } catch {}"],
]) test(`network guard rejects dns ${name}`, () => run(code));
