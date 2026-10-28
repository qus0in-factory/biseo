import { PublicProtocol } from 'paseto'
import {
  ExportPublicKeyFactory,
  ExportSecretKeyFactory,
  GenerateKeyPairFactory,
  SignFactory,
  VerifyFactory,
} from 'paseto/v4/public'
import { hashPassword } from '../infra/password.js'

const proto = new PublicProtocol(
  GenerateKeyPairFactory,
  SignFactory,
  VerifyFactory,
  ExportSecretKeyFactory,
  ExportPublicKeyFactory,
)

export async function createTestFixture() {
  const password = 'test-password-123'
  const stored = await hashPassword(password)
  const { secretKey, publicKey } = await proto.GenerateKeyPair({ extractable: true })
  const secretKeyStr = (await (proto as any).ExportSecretKey(secretKey)) as string
  const publicKeyStr = (await (proto as any).ExportPublicKey(publicKey)) as string
  return { password, stored, secretKeyStr, publicKeyStr }
}

export const mockPassRateLimiter = {
  limit: async () => ({ success: true }),
}
