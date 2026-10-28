import { GetPublicKeyFactory, ImportSecretKeyFactory } from 'paseto/v4/public'
import { PasetoV4PublicSigner, PasetoV4PublicVerifier } from '../../shared/infra/paseto-v4-public.js'
import { WebCryptoPasswordVerifier } from '../infra/password.js'
import type { SessionBindings } from './types.js'

export async function createAdapters(env: SessionBindings) {
  const secretKeyStr = env.USER_SESSION_PASETO_SECRET
  const storedVerifier = env.AUTH_PASSWORD_VERIFIER
  if (!secretKeyStr || !storedVerifier) return null
  try {
    const importSec = ImportSecretKeyFactory()
    const sk = await importSec.run(secretKeyStr as `k4.secret.${string}`)
    const getPub = GetPublicKeyFactory()
    const pk = await getPub.run(sk)
    const signer = new PasetoV4PublicSigner(sk)
    const verifier = new PasetoV4PublicVerifier(pk)
    const pwVerifier = new WebCryptoPasswordVerifier()
    return { signer, verifier, pwVerifier, storedVerifier }
  } catch {
    return null
  }
}
