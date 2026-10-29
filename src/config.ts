import {base}from'./config-file.js'
const e=process.env
export const config={
 host:e.HOST??base.host,
 port:Number(e.PORT??base.port),
 healthStatus:e.HEALTH_STATUS??base.healthStatus,
 serviceIssuer:e.SERVICE_ISSUER??base.serviceIssuer,
 serviceAudience:e.SERVICE_AUDIENCE??base.serviceAudience,
 servicePublicKeyPath:e.SERVICE_PUBLIC_KEY_PATH??base.servicePublicKeyPath,
 allowedWorkspaceId:e.ALLOWED_WORKSPACE_ID??base.allowedWorkspaceId,
 turnTimeoutMs:Number(e.TURN_TIMEOUT_MS||base.turnTimeoutMs||1800000),
 lateCaptureMs:Number(e.LATE_CAPTURE_MS||base.lateCaptureMs||7200000),
 captureGraceMs:Number(e.CAPTURE_GRACE_MS||base.captureGraceMs||3000),
 logLevel:e.LOG_LEVEL??base.logLevel??'info',
}
if(!config.serviceIssuer||!config.serviceAudience||!config.servicePublicKeyPath)throw new Error('service auth misconfigured')
if(!(Number(config.turnTimeoutMs)>0)||!(Number(config.lateCaptureMs)>=0)||!(Number(config.captureGraceMs)>=0))throw new Error('turn config misconfigured')
