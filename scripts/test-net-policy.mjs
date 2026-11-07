import { BlockList, isIP } from 'node:net';

const loopback = new BlockList();
loopback.addSubnet('127.0.0.0', 8, 'ipv4');
loopback.addAddress('::1', 'ipv6');

export function checkHost(host = 'localhost') {
  const name = String(host ?? '').toLowerCase().replace(/^\[|\]$/g, '').replace(/\.$/, '');
  if (name === '' || name === 'localhost') return;
  if (loopback.check(name, isIP(name) === 6 ? 'ipv6' : 'ipv4')) return;
  process.exitCode = 1;
  console.error(`test-net-guard: ${name}`);
  throw new Error(`test-net-guard: ${name}`);
}
