import type{config}from'./config.js'
type C=typeof config
export function validateConfig(c:C){
 if(!c.serviceIssuer||!c.serviceAudience||!c.servicePublicKeyPath)throw new Error('service auth misconfigured')
 if(!(Number(c.turnTimeoutMs)>0)||!(Number(c.lateCaptureMs)>=0)||!(Number(c.captureGraceMs)>=0)||!(Number(c.promptAcceptanceMs)>0)||!(Number(c.firstSessionMs)>0)||!(Number(c.targetGraceMs)>=0))throw new Error('turn config misconfigured')
}
