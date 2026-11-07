import dns from 'node:dns';
import { syncBuiltinESMExports } from 'node:module';
import { checkHost } from './test-net-policy.mjs';

const QUERIES = ['lookup', 'resolve', 'resolve4', 'resolve6', 'resolveAny', 'resolveCaa',
  'resolveCname', 'resolveMx', 'resolveNaptr', 'resolveNs', 'resolvePtr', 'resolveSoa',
  'resolveSrv', 'resolveTxt'];

function guard(fn, isAsync) {
  if (!isAsync) return function (hostname, ...args) {
    checkHost(hostname);
    return fn.call(this, hostname, ...args);
  };
  return async function (hostname, ...args) {
    checkHost(hostname);
    return fn.call(this, hostname, ...args);
  };
}

for (const name of QUERIES) {
  if (typeof dns[name] === 'function') dns[name] = guard(dns[name], false);
  if (typeof dns.promises[name] === 'function') dns.promises[name] = guard(dns.promises[name], true);
}

syncBuiltinESMExports();
