import { PublicProtocol } from 'paseto'
import {
  ExportPublicKeyFactory, ExportSecretKeyFactory, GenerateKeyPairFactory,
  ImportPublicKeyFactory, ImportSecretKeyFactory,
} from 'paseto/v4/public'

export const keyProtocol = new PublicProtocol(
  GenerateKeyPairFactory,
  ExportPublicKeyFactory, ExportSecretKeyFactory,
  ImportPublicKeyFactory, ImportSecretKeyFactory,
)

export const generateKeys = () => keyProtocol.GenerateKeyPair()
export const generateExtractableKeys = () => keyProtocol.GenerateKeyPair({ extractable: true })
