import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

for (const host of ['', 'localhost.']) {
  test(`network policy permits loopback host ${JSON.stringify(host)}`, () => {
    const result = spawnSync(process.execPath, [
      '--import=./scripts/test-net-guard.mjs', '--input-type=module', '-e',
      `const { checkHost } = await import('./scripts/test-net-policy.mjs'); checkHost(${JSON.stringify(host)});`,
    ], { encoding: 'utf8', timeout: 5000 });
    assert.equal(result.status, 0, result.stderr);
  });
}
