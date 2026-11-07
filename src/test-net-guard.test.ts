import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

for (const code of [
  "fetch('https://user:secret@example.invalid/private?token=secret')",
  "fetch(new Request('https://example.invalid/private'))",
  "(await import('node:net')).connect(443, 'example.invalid')",
  "(await import('node:tls')).connect({host:'example.invalid',port:443})",
  "(await import('node:dgram')).createSocket('udp4').connect(53,'example.invalid')",
  "(await import('node:dgram')).createSocket('udp4').send('x',53,'example.invalid')",
]) {
  test(`network guard rejects ${code.split('(')[0]}`, () => {
    const result = spawnSync(process.execPath, [
      '--import=./scripts/test-net-guard.mjs', '--input-type=module',
      '-e', `try { await ${code} } catch {}`,
    ], { encoding: 'utf8' });
    assert.equal(result.status, 1);
    assert.equal(result.stderr.trim(), 'test-net-guard: example.invalid');
  });
}
