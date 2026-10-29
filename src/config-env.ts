import {base}from'./config-file.js'
import {parseInterruptAllowlist,parseLimitMarkers}from'./config-parse.js'
const e=process.env
export const envConfig={
 allowedWorkspaceId:e.ALLOWED_WORKSPACE_ID??base.allowedWorkspaceId,
 turnTimeoutMs:Number(e.TURN_TIMEOUT_MS||base.turnTimeoutMs||1800000),
 lateCaptureMs:Number(e.LATE_CAPTURE_MS||base.lateCaptureMs||7200000),
 captureGraceMs:Number(e.CAPTURE_GRACE_MS||base.captureGraceMs||3000),
 promptAcceptanceMs:Number(e.PROMPT_ACCEPTANCE_MS||base.promptAcceptanceMs||8000),
 firstSessionMs:Number(e.FIRST_SESSION_MS||base.firstSessionMs||15000),
 targetGraceMs:Number(e.TARGET_GRACE_MS||base.targetGraceMs||1000),
 limitMarkers:parseLimitMarkers(e.LIMIT_MARKERS)??base.limitMarkers??[],
 interruptAllowlist:parseInterruptAllowlist(e.INTERRUPT_ALLOWLIST)??base.interruptAllowlist??{default:['esc']},
 availabilityTtlMs:Number(e.AVAILABILITY_TTL_MS??base.availabilityTtlMs),
 logLevel:e.LOG_LEVEL??base.logLevel??'info',
}
