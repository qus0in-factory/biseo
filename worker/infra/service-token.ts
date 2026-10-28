import { issueClaims } from '../../shared/domain/issue.js'
import { importSigningKey } from '../../shared/infra/paserk.js'
import { PasetoV4PublicSigner } from '../../shared/infra/paseto-v4-public.js'
import type { ServiceTokenEnv } from './service-token-env.js'
import { getServiceTokenPolicy, serviceTokenSubject } from './service-token-policy.js'

export async function createServiceToken(
  env: ServiceTokenEnv,
  now = new Date(),
): Promise<string | null> {
  if (!env.SERVICE_PASETO_SECRET) return null
  if (env.SERVICE_PASETO_SECRET === env.USER_SESSION_PASETO_SECRET) return null
  try {
    const key = await importSigningKey(env.SERVICE_PASETO_SECRET as `k4.secret.${string}`)
    const policy = getServiceTokenPolicy(env)
    if (policy.audiences.service === policy.audiences['user-session']) return null
    const claims = issueClaims(policy, 'service', serviceTokenSubject(env), now)
    return await new PasetoV4PublicSigner(key).sign(claims)
  } catch {
    return null
  }
}
