import type{config}from'./config.js'
import{validInterruptAllowlist}from'./config-allowlist.js'
type C=typeof config
const badList=(v:unknown)=>!Array.isArray(v)||v.some(m=>typeof m!=='string'||!m.trim())
export function missingConfigKeys(c:C):string[]{
 const miss:string[]=[]
 for(const k of['serviceIssuer','serviceAudience','servicePublicKeyPath']as const)
  if(!c[k])miss.push(k)
 for(const k of['turnTimeoutMs','promptAcceptanceMs','firstSessionMs','availabilityTtlMs','ollamaIncludedUsd']as const)
  if(!(Number(c[k])>0))miss.push(k)
 for(const k of['lateCaptureMs','captureGraceMs','targetGraceMs']as const)
  if(!(Number(c[k])>=0))miss.push(k)
 for(const k of['limitMarkers','inputMarkers']as const)
  if(badList(c[k]))miss.push(k)
 if(!validInterruptAllowlist(c.interruptAllowlist))miss.push('interruptAllowlist')
 if(typeof c.agyCliEnabled!=='boolean')miss.push('agyCliEnabled')
 return miss
}
