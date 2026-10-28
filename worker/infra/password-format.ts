import { fromHex, toHex } from './password-crypto.js'

export type StoredHash = {
  digest: 'SHA-256' | 'SHA-512'
  iterations: number
  salt: Uint8Array
  hash: Uint8Array
}

export function formatStored(d: string, iter: number, salt: Uint8Array, hash: Uint8Array): string {
  return `pbkdf2$${d.toLowerCase()}$${iter}$${toHex(salt)}$${toHex(hash)}`
}

export function parseStored(stored: string): StoredHash | null {
  const parts = stored.split('$')
  if (parts.length !== 5 || parts[0] !== 'pbkdf2') return null
  const [, digestRaw, iterStr, saltHex, hashHex] = parts
  const iterations = parseInt(iterStr, 10)
  if (!Number.isInteger(iterations) || iterations <= 0) return null
  const d = digestRaw.toUpperCase()
  if (d !== 'SHA-256' && d !== 'SHA-512') return null
  try {
    return { digest: d, iterations, salt: fromHex(saltHex), hash: fromHex(hashHex) }
  } catch {
    return null
  }
}
