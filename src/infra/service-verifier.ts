import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { importVerificationKey } from '../../shared/infra/paserk.js'
import { PasetoV4PublicVerifier } from '../../shared/infra/paseto-v4-public.js'
export async function loadServiceVerifier(keyPath: string) {
  let paserk = ''
  try {
    paserk = readFileSync(resolve(process.cwd(), keyPath), 'utf8').trim()
  } catch {
    throw new Error('service auth misconfigured')
  }
  if (!paserk) throw new Error('service auth misconfigured')
  const key = await importVerificationKey(paserk as `k4.public.${string}`)
  return new PasetoV4PublicVerifier(key, 5)
}
