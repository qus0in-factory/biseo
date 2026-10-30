import { createPrivateKey, createPublicKey } from 'node:crypto'
export function createOllamaKey(privateRaw: Buffer): { key: any; derived: Buffer } {
  const key = createPrivateKey({ format: 'der', type: 'pkcs8', key: Buffer.concat([
    Buffer.from('302e020100300506032b657004220420', 'hex'), privateRaw.subarray(0, 32),
  ]) })
  const derived = createPublicKey(key).export({ format: 'der', type: 'spki' }).subarray(-32)
  return { key, derived }
}
