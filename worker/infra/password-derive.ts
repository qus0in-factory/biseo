import { assertValidIterations } from './password-types.js'

export async function deriveKey(
  pass: string,
  salt: Uint8Array,
  iter: number,
  len: number,
  digest: string,
): Promise<Uint8Array> {
  assertValidIterations(iter)
  const enc = new TextEncoder()
  const baseKey = await crypto.subtle.importKey('raw', enc.encode(pass), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: salt as BufferSource, iterations: iter, hash: digest },
    baseKey,
    len * 8,
  )
  return new Uint8Array(bits)
}
