import { PublicProtocol } from 'paseto'
import { SignFactory, VerifyFactory, type PublicKey, type SecretKey } from 'paseto/v4/public'
import type { Claims } from '../domain/claims.js'
import type { ClaimsSigner, ClaimsVerifier } from '../domain/ports.js'

const protocol = new PublicProtocol(SignFactory, VerifyFactory)

export class PasetoV4PublicSigner implements ClaimsSigner {
  constructor(private readonly secretKey: SecretKey) {}

  sign(claims: Claims): Promise<string> {
    return protocol.Sign(this.secretKey, claims)
  }
}

export class PasetoV4PublicVerifier implements ClaimsVerifier {
  constructor(
    private readonly publicKey: PublicKey,
    private readonly clockToleranceSeconds = 0,
  ) {}

  async verify(token: string): Promise<unknown> {
    const options = { clockTolerance: this.clockToleranceSeconds }
    return (await protocol.Verify(this.publicKey, token, options)).claims
  }
}
