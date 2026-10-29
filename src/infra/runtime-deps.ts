import{config as c}from'../config.js'
import{createAvailability}from'./codex-availability.js'
import{createCapture}from'./transcript-capture.js'
import{createState}from'./herdr-watch-boot.js'
import{HerdrCli}from'./herdr-cli.js'
import{limitScreen}from'../app/limit-screen.js'
import type{TurnDeps}from'../app/turn-deps.js'
type Verify=(t?:string)=>Promise<void>
export function runtimeDeps(verify:Verify):TurnDeps&{verify:Verify;healthStatus:string}{
 const{store,locks,queue}=createState(),herdr=new HerdrCli()
 return{verify,healthStatus:c.healthStatus,allowedWorkspaceId:c.allowedWorkspaceId,store,locks,queue,herdr,capture:createCapture(),availability:createAvailability(),limit:limitScreen(herdr,c.limitMarkers),interruptAllowlist:c.interruptAllowlist,timeoutMs:c.turnTimeoutMs,graceMs:c.captureGraceMs,lateCaptureMs:c.lateCaptureMs,promptAcceptanceMs:c.promptAcceptanceMs,firstSessionMs:c.firstSessionMs,targetGraceMs:c.targetGraceMs}
}
