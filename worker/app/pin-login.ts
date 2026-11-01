import{issueClaims}from'../../shared/domain/issue.js'
import{reservePin}from'./pin-reserve.js'
import{isValidPin}from'../domain/pin-value.js'
import type{PinLoginDeps,PinLoginResult}from'./pin-login-types.js'
export async function pinLogin(d:PinLoginDeps,pin:unknown):Promise<PinLoginResult>{
 const now=d.now?.()??Date.now()
 const ipScope=`ip:${d.ip}`
 if(!(await d.trusted.has(d.ip)))return{ok:false,status:401}
 const reservation=await reservePin(d,ipScope,now)
 if(!reservation.ok)return reservation
 const denied=reservation.denied
 if(!isValidPin(pin))return denied
 const stored=await d.pin.getHash()
 const ok=stored?await d.verifier.verify(pin,stored):false
 if(!ok)return denied
 await Promise.all([d.attempts.clear(ipScope),d.attempts.release('global')])
 const policy={...d.policy,ttlSeconds:{...d.policy.ttlSeconds,'user-session':d.limits.sessionTtl}}
 const claims={...issueClaims(policy,'user-session',d.subject),auth:'pin' as const}
 return{ok:true,token:await d.signer.sign(claims)}
}
