import dns from 'node:dns';
import { syncBuiltinESMExports } from 'node:module';
import { checkHost } from './test-net-policy.mjs';

const blocked = name => /^(resolve|lookup|reverse)/.test(name);

function guard(fn, isAsync) {
  const wrapped = isAsync ? async function (hostname, ...args) {
    checkHost(hostname);
    return fn.call(this, hostname, ...args);
  } : function (hostname, ...args) {
    checkHost(hostname);
    return fn.call(this, hostname, ...args);
  };
  wrapped.__guarded = true;
  return wrapped;
}

function patch(target, isAsync) {
  for (const name of Object.getOwnPropertyNames(target))
    if (blocked(name) && typeof target[name] === 'function')
      target[name] = guard(target[name], isAsync);
}

patch(dns, false);
patch(dns.promises, true);
patch(dns.Resolver.prototype, false);
patch(dns.promises.Resolver.prototype, true);
syncBuiltinESMExports();
