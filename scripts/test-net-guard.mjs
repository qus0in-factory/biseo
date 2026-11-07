import './test-net-socket.mjs';
import './test-net-datagram.mjs';
import { checkHost } from './test-net-policy.mjs';

const fetch = globalThis.fetch;
globalThis.fetch = function (input, init) {
  const url = new URL(input instanceof Request ? input.url : input);
  checkHost(url.hostname);
  return fetch.call(this, input, init);
};
