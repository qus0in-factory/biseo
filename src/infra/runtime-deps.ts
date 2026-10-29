import{config as c}from'../config.js'
import{createAvailability}from'./codex-availability.js'
import{createCapture}from'./transcript-capture.js'
import{createState}from'./herdr-watch-boot.js'
import{HerdrCli}from'./herdr-cli.js'
import type{TurnDeps}from'../app/turn-deps.js'
type Verify=(t?:string)=>Promise<void>
export function runtimeDeps(verify:Verify):TurnDeps&{verify:Verify;healthStatus:string}{
 const{store,locks,queue}=createState()
 return{verify,healthStatus:c.healthStatus,allowedWorkspaceId:c.allowedWorkspaceId,store,locks,queue,herdr:new HerdrCli(),capture:createCapture(),availability:createAvailability(),timeoutMs:c.turnTimeoutMs,graceMs:c.captureGraceMs,lateCaptureMs:c.lateCaptureMs,promptAcceptanceMs:c.promptAcceptanceMs,targetGraceMs:c.targetGraceMs}
}
