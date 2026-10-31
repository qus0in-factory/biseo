import type{D1Database}from'@cloudflare/workers-types'
import type{PinAttemptStore}from'../app/pin-ports.js'
import{BUMP_SQL}from'./pin-attempt-sql.js'
export function createD1PinAttempts(db:D1Database):PinAttemptStore{return{
 async locked(scope,now){
  const r=await db.prepare('SELECT locked_until FROM pin_attempts WHERE scope=?').bind(scope).first<{locked_until:number}>()
  if(!r)return false
  if(r.locked_until>now)return true
  if(r.locked_until>0)await db.prepare('DELETE FROM pin_attempts WHERE scope=?').bind(scope).run()
  return false
 },
 async fail(scope,limits,now){
  const r=await db.prepare(BUMP_SQL).bind(scope,now,limits.windowSeconds*1000,limits.max,limits.lockSeconds*1000).first<{locked_until:number}>()
  return!!r&&r.locked_until>now
 },
 async clear(scope){await db.prepare('DELETE FROM pin_attempts WHERE scope=?').bind(scope).run()},
}}
