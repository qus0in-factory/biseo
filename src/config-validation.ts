import type{config}from'./config.js'
import {validInterruptAllowlist}from'./config-allowlist.js'
type C=typeof config
export function validateConfig(c:C){
 if(!c.serviceIssuer||!c.serviceAudience||!c.servicePublicKeyPath)throw new Error('service auth misconfigured')
 if(!(Number(c.turnTimeoutMs)>0)||!(Number(c.lateCaptureMs)>=0)||!(Number(c.captureGraceMs)>=0)||!(Number(c.promptAcceptanceMs)>0)||!(Number(c.targetGraceMs)>=0))throw new Error('turn config misconfigured')
 if(!Array.isArray(c.limitMarkers)||c.limitMarkers.some(m=>typeof m!=='string'||!m.trim()))throw new Error('limit markers misconfigured')
 if(!validInterruptAllowlist(c.interruptAllowlist))throw new Error('interrupt allowlist misconfigured')
}
