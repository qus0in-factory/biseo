import type{PinLoginDeps}from'../app/pin-login-types.js'
import{createAdapters}from'./adapters.js'
import{getClaimPolicy}from'./config.js'
import{createD1PinAttempts}from'../infra/d1-pin-attempts.js'
import{createD1PinStore}from'../infra/d1-pin-store.js'
import{createD1TrustedIp}from'../infra/d1-trusted-ip.js'
import{WebCryptoPinVerifier}from'../infra/pin-hash.js'
import{getPinConfig}from'./pin-config.js'
import type{SessionBindings}from'./types.js'
export async function createPinDeps(env:SessionBindings,ip:string):Promise<PinLoginDeps|null>{
 const db=env.BISEO_DB
 const ad=await createAdapters(env)
 if(!db||!ad)return null
 return{trusted:createD1TrustedIp(db),pin:createD1PinStore(db),attempts:createD1PinAttempts(db),
  verifier:new WebCryptoPinVerifier(env.PIN_PEPPER||''),signer:ad.signer,policy:getClaimPolicy(env),
  subject:env.SESSION_SUBJECT||'owner',ip,limits:getPinConfig(env)}
}
