import { issueClaims } from '../../shared/domain/issue.js'
import { createAdapters } from './adapters.js'
import { getClaimPolicy } from './config.js'
import { getPinConfig } from './pin-config.js'
import type { RefreshSession } from '../domain/refresh-types.js'
import type { SessionBindings } from './types.js'

export async function refreshAccess(env: SessionBindings, s: RefreshSession, now: number) {
 const ad = await createAdapters(env)
 if (!ad) throw new Error('signer unavailable')
 const policy = getClaimPolicy(env)
 const age = Math.min(policy.ttlSeconds['user-session'],s.expires-now,
  s.auth === 'pin' ? getPinConfig(env).sessionTtl : Infinity)
 policy.ttlSeconds['user-session'] = age
 const claims = issueClaims(policy,'user-session',s.subject,new Date(now*1000))
 return { token: await ad.signer.sign(s.auth === 'pin' ? {...claims,auth:'pin'} : claims), age }
}
