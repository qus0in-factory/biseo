import { Socket } from 'node:net';
import { syncBuiltinESMExports } from 'node:module';
import { checkHost } from './test-net-policy.mjs';

const connect = Socket.prototype.connect;
Socket.prototype.connect = function (...args) {
  const first = Array.isArray(args[0]) ? args[0][0] : args[0];
  const options = typeof first === 'object' ? first : {};
  const host = options.host ?? (typeof args[1] === 'string' ? args[1] : undefined);
  if (options.path || (typeof first === 'string' && !/^\d+$/.test(first))) {
    return connect.apply(this, args); // Local IPC has no network destination.
  }
  checkHost(host);
  return connect.apply(this, args);
};
syncBuiltinESMExports();
