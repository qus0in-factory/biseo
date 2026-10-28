import type { PublicKey, SecretKey } from 'paseto/v4/public'
import { keyProtocol } from './keys.js'

export type PaserkPair = {
  secretKey: `k4.secret.${string}`
  publicKey: `k4.public.${string}`
}

export const exportKeys = async (keys: {
  publicKey: PublicKey
  secretKey: SecretKey
}): Promise<PaserkPair> => ({
  secretKey: await keyProtocol.ExportSecretKey(keys.secretKey),
  publicKey: await keyProtocol.ExportPublicKey(keys.publicKey),
})

export const importSigningKey = (paserk: `k4.secret.${string}`) =>
  keyProtocol.ImportSecretKey(paserk)

export const importVerificationKey = (paserk: `k4.public.${string}`) =>
  keyProtocol.ImportPublicKey(paserk)
