import { Socket } from 'node:dgram';
import { checkHost } from './test-net-policy.mjs';

const connect = Socket.prototype.connect;
Socket.prototype.connect = function (port, address, ...args) {
  checkHost(typeof address === 'string' ? address : undefined);
  return connect.call(this, port, address, ...args);
};

const send = Socket.prototype.send;
Socket.prototype.send = function (...args) {
  checkHost(args.slice(1).find(value => typeof value === 'string'));
  return send.apply(this, args);
};
