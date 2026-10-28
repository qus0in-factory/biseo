import type { PasswordVerifier } from '../app/ports.js'
import { DEFAULT_PBKDF2_CONFIG as DEF, type Pbkdf2Config } from './password-types.js'
import { timingSafeEqual } from './password-crypto.js'
import { formatStored, parseStored } from './password-format.js'
import { deriveKey } from './password-derive.js'

export async function hashPassword(
  pass: string,
  cfg: Pbkdf2Config = DEF,
  saltBytes = 16,
): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(saltBytes))
  const d = await deriveKey(pass, salt, cfg.iterations, cfg.keyLength, cfg.digest)
  return formatStored(cfg.digest, cfg.iterations, salt, d)
}

export class WebCryptoPasswordVerifier implements PasswordVerifier {
  async verify(password: string, stored: string): Promise<boolean> {
    const p = parseStored(stored)
    if (!p) return false
    const d = await deriveKey(password, p.salt, p.iterations, p.hash.length, p.digest)
    return timingSafeEqual(d, p.hash)
  }
}
