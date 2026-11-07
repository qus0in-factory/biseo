import { test } from 'node:test';
import assert from 'node:assert/strict';
import dns from 'node:dns';
import '../scripts/test-net-guard.mjs';

test('dns query methods wrapped', () => {
  const modules = [dns, dns.promises];
  const resolvers = [dns.Resolver.prototype, dns.promises.Resolver.prototype];
  for (const target of [...modules, ...resolvers]) {
    assert.ok(target.reverse.__guarded, 'reverse');
    for (const name of Object.getOwnPropertyNames(target))
      if (name.startsWith('resolve')) assert.ok(target[name].__guarded, name);
  }
  for (const target of modules)
    assert.ok(target.lookupService.__guarded, 'lookupService');
});
