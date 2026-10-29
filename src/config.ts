import {base}from'./config-file.js'
import {validateConfig}from'./config-validation.js'
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
 promptAcceptanceMs:Number(e.PROMPT_ACCEPTANCE_MS||base.promptAcceptanceMs||8000),
 targetGraceMs:Number(e.TARGET_GRACE_MS||base.targetGraceMs||1000),
 logLevel:e.LOG_LEVEL??base.logLevel??'info',
}
validateConfig(config)
