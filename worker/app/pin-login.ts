import{issueClaims}from'../../shared/domain/issue.js'
import{isValidPin}from'../domain/pin-value.js'
import type{PinLoginDeps,PinLoginResult}from'./pin-login-types.js'
import{failPin}from'./pin-fail.js'
export async function pinLogin(d:PinLoginDeps,pin:unknown):Promise<PinLoginResult>{
 const now=d.now?.()??Date.now()
 const ipScope=`ip:${d.ip}`
 const scopes=[ipScope,'global']
 for(const scope of scopes)if(await d.attempts.locked(scope,now))return{ok:false,status:429}
 if(!(await d.trusted.has(d.ip)))return{ok:false,status:401}
 if(!isValidPin(pin))return failPin(d,ipScope,now)
 const stored=await d.pin.getHash()
 const ok=stored?await d.verifier.verify(pin,stored):false
 if(!ok)return failPin(d,ipScope,now)
 await Promise.all(scopes.map(s=>d.attempts.clear(s)))
 const policy={...d.policy,ttlSeconds:{...d.policy.ttlSeconds,'user-session':d.limits.sessionTtl}}
 const claims={...issueClaims(policy,'user-session',d.subject),auth:'pin' as const}
 return{ok:true,token:await d.signer.sign(claims)}
}
