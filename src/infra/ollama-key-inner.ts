import { sign } from 'node:crypto'
import { Reader } from './ollama-key-reader.js'
import { createOllamaKey } from './ollama-key-create.js'
export function buildSigner(publicBlob: Buffer, innerBytes: Buffer): (challenge: string) => string {
  const inner = new Reader(innerBytes)
  if (inner.uint() !== inner.uint() || inner.string().toString() !== 'ssh-ed25519') throw new Error('bad inner')
  const publicRaw = inner.string()
  const privateRaw = inner.string()
  if (privateRaw.length !== 64 || publicRaw.length !== 32) throw new Error('bad key')
  const { key, derived } = createOllamaKey(privateRaw)
  const pub = new Reader(publicBlob)
  if (!derived.equals(publicRaw) || !derived.equals(privateRaw.subarray(32)) ||
    pub.string().toString() !== 'ssh-ed25519' || !pub.string().equals(derived)) throw new Error('bad pub')
  return challenge => `${publicBlob.toString('base64')}:${sign(null, Buffer.from(challenge), key).toString('base64')}`
}
