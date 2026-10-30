import{base}from'./config-file.js'
import{parseInterruptAllowlist,parseLimitMarkers}from'./config-parse.js'
const e=process.env
export const envConfig={
 allowedWorkspaceId:e.ALLOWED_WORKSPACE_ID??base.allowedWorkspaceId,
 turnTimeoutMs:Number(e.TURN_TIMEOUT_MS||base.turnTimeoutMs||1.8e6),
 lateCaptureMs:Number(e.LATE_CAPTURE_MS||base.lateCaptureMs||7.2e6),
 captureGraceMs:Number(e.CAPTURE_GRACE_MS||base.captureGraceMs||3000),
 promptAcceptanceMs:Number(e.PROMPT_ACCEPTANCE_MS||base.promptAcceptanceMs||8000),
 firstSessionMs:Number(e.FIRST_SESSION_MS||base.firstSessionMs||15000),
 targetGraceMs:Number(e.TARGET_GRACE_MS||base.targetGraceMs||1e3),
 limitMarkers:parseLimitMarkers(e.LIMIT_MARKERS)??base.limitMarkers??[],inputMarkers:parseLimitMarkers(e.INPUT_MARKERS)??base.inputMarkers??[],
 interruptAllowlist:parseInterruptAllowlist(e.INTERRUPT_ALLOWLIST)??base.interruptAllowlist??{default:['esc']},
 availabilityTtlMs:Number(e.AVAILABILITY_TTL_MS??base.availabilityTtlMs),
}
