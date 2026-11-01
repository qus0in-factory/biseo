import type {D1Database} from '@cloudflare/workers-types'
import type {PinAttemptLimits} from '../app/pin-ports.js'
import {BUMP_SQL} from './pin-attempt-sql.js'
export function reservationMethods(db:D1Database){return{
 async reserve(scope:string,limits:PinAttemptLimits,now:number){
  const r=await db.prepare(BUMP_SQL).bind(scope,now,limits.windowSeconds*1000,limits.max,limits.lockSeconds*1000).first<{failures:number}>()
  if(!r)throw new Error('PIN reservation failed')
  return r.failures
 },
 async release(scope:string){await db.prepare('UPDATE pin_attempts SET failures=MAX(failures-1,0) WHERE scope=?').bind(scope).run()},
}}
