import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

for (const host of ['127.0.0.1', '::1']) {
  test(`network guard permits loopback HTTP on ${host}`, () => {
    const result = spawnSync(process.execPath, [
      '--import=./scripts/test-net-guard.mjs', '--input-type=module', '-e', `
      import { createServer } from 'node:http';
      const host = ${JSON.stringify(host)};
      const server = createServer((req, res) => res.end('ok'));
      await new Promise(resolve => server.listen(0, host, resolve));
      try {
        const urlHost = host.includes(':') ? '[' + host + ']' : host;
        const res = await fetch('http://' + urlHost + ':' + server.address().port);
        if (await res.text() !== 'ok') process.exitCode = 1;
      } finally { server.closeAllConnections(); server.close(); }
    `], { encoding: 'utf8', timeout: 5000 });
    assert.equal(result.status, 0, result.stderr);
  });
}
